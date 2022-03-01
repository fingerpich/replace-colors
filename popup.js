// Initialize button with user's preferred color

document.addEventListener('DOMContentLoaded', function(event) {
  const firstButton = document.getElementById("getColors");
  firstButton.addEventListener('click', async () => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: loadColors,
    }, (injectionResults) => {
      for (const frameResult of injectionResults) {
        const colorsList = frameResult.result
        const colorUsage = colorsList.reduce((obj, color) => {
          if (!obj[color]) { obj[color] = 1}
          else { obj[color]++ }
          return obj
        }, {})
      
        const uniqueColors = Object
          .keys(colorUsage)
          .sort((a, b) => colorUsage[b] - colorUsage[a])

        let existColorsContainer = document.getElementById("existColors");
        const changedColors = {}
        uniqueColors.forEach((color) => {
          const label = document.createElement('label')
          const input = document.createElement('input')
          input.addEventListener('input', (e) => {
            const newColor = e.target.value
            if (colorUsage[newColor]) {return } // prevent changing color to one of input colors
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              function: replaceColor,
              args: [changedColors[color] || color, newColor],
            })
            changedColors[color] = newColor
          })
          input.type = "color"
          input.value = color
          const span = document.createElement('span')
          span.innerText = color
          label.appendChild(span)
          label.appendChild(input)
          existColorsContainer.appendChild(label)
        })
      }
    })
  })
});

function loadColors() {
  const styles = document.getElementsByTagName('style')
  const colorsList = Array.from(styles).reduce((list, style) => {
    const reg = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g
    const colors = style.innerHTML.match(reg)
    return [...list, ...(colors || [])]
  }, [])

  return colorsList
}

function replaceColor(oldColor, newColor) {
  const styles = document.getElementsByTagName('style')
  Array.from(styles).forEach((style) => {
    const reg = new RegExp(oldColor, 'ig')
    style.innerHTML = style.innerHTML.replace(reg, newColor)
  })
}
