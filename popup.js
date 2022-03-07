
document.addEventListener('DOMContentLoaded', async function(event) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: loadColors,
  }, (injectionResults) => {
    for (const frameResult of injectionResults) {
      const colorsList = frameResult.result
      // unify colors
      const colorUsage = colorsList.reduce((obj, color) => {
        if (!obj[color]) { obj[color] = 1}
        else { obj[color]++ }
        return obj
      }, {})
      // sort colors by the frequent
      const uniqueSortedColors = Object
        .keys(colorUsage)
        .sort((a, b) => colorUsage[b] - colorUsage[a])

      let colorsListEl = document.getElementById("colorsList");
      const changedColors = {}
      uniqueSortedColors.forEach((color) => {
        const label = document.createElement('label')
        const input = document.createElement('input')
        input.addEventListener('input', (e) => {
          const newColor = e.target.value
          if (colorUsage[newColor]) {return } // prevent changing color to one of input colors
          console.log(color, newColor)
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: replaceColor,
            args: [changedColors[color] || color, newColor],
          })
          changedColors[color] = newColor
        })
        input.type = "color"
        input.value = convertToValidHexColor(color)
        const colorName = document.createElement('small')
        colorName.innerHTML = color
        const span = document.createElement('span')
        span.style.background = color
        
        const arrow = document.createElement('div')
        arrow.innerHTML = `
          <svg id="icon-arrow-right" viewBox="0 0 32 32">
            <path d="M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"></path>
          </svg>
        `
        const useEl = document.createElement('use')
        useEl.setAttribute('xlink:href', '#icon-arrow-right')
        arrow.appendChild(useEl)
        label.appendChild(colorName)
        label.appendChild(span)
        label.appendChild(arrow)
        label.appendChild(input)
        colorsListEl.appendChild(label)
      })
    }
  })
});

function loadColors() {
  const styles = document.getElementsByTagName('style')
  const colorsList = Array.from(styles).reduce((list, style) => {
    // const reg = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g
    const reg = /(#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4}))|rgba?\([\d,\.\s]*\)|hsla\([\d,\%\.\s]*\)/g
    const colors = style.innerHTML.match(reg)
    return [...list, ...(colors || [])]
  }, [])

  return colorsList
}

function replaceColor(oldColor, newColor) {
  const styles = document.getElementsByTagName('style')
  Array.from(styles).forEach((style) => {
    let scapedStr = oldColor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    scapedStr = scapedStr
      .replace('0\\.','0?\\.')
      // .replace(',','\\s*,\\s*')
    const reg = new RegExp(scapedStr, 'ig')
    console.log(reg)
    // const reg = new RegExp(`(${oldColor})([\\s;!])`, 'ig')
    // style.innerHTML = style.innerHTML.replace(reg, (a,b, end)=> newColor+end)
    style.innerHTML = style.innerHTML.replace(reg, newColor)
  })
}

function convertToValidHexColor(color) {
  let hexColor = color
  if (color.startsWith('rgba(')) {
    hexColor = rgbaToHex(color)
  } else if (color.startsWith('rgb(')) {
    hexColor = rgbToHex(color)
  } else if (color.length < 5 && color.startsWith('#')) {
    hexColor = expandHex(color);
  }
  return hexColor.slice(0, 7)
}

function rgbaToHex(color) {
  const match = color.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16)+ //R
    (+match[2]).toString(16)+ //G
    (+match[3]).toString(16)+ //B
    (Math.round(+match[4]*255).toString(16)) //A
  :'#000000'
}

function rgbToHex(color) {
  const match = color.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16)+ //R
    (+match[2]).toString(16)+ //G
    (+match[3]).toString(16) //B
  :'#000000'
}

function expandHex(color) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  return color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
}
