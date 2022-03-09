import { runFunctionInPage } from "./extension.js"
import { fetchedColors, namedColors } from "../color.js"

export function changeColorsList() {
  const lastColors = fetchedColors.map(fetchColor => fetchColor.lastColor)
  const lookup = {}
  const newColors = fetchedColors.map(fetchColor => {
    const c = (fetchColor.alpha < 1) ? 
      (fetchColor.newColor + (fetchColor.alpha * 255).toString(16)) : 
      fetchColor.newColor
    if (!lookup[c]) { lookup[c] = 1; }
    else { return fetchColor.lastColor }
    return c;
  })
  newColors.forEach((c, index) => {
    fetchedColors[index].lastColor = c
  })
  return runFunctionInPage(replaceColorsList, [lastColors, newColors])
}

function replaceColorsList(oldColors, newColors) {
  const styles = document.getElementsByTagName('style')
  const mapObj = oldColors.reduce((obj, color, index) => {
    obj[color.toLowerCase()] = newColors[index]
    return obj
  }, {})
  const regexEscape = color => color.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    // .replace('0\\.','0?\\.')
    // .replace(',','\\s*,\\s*')
  const reg = new RegExp(oldColors.map(regexEscape).join("|"), 'gi')
  Array.from(styles).forEach((style) => {
    style.innerHTML = style.innerHTML.replace(reg, (matched) => mapObj[matched.toLowerCase()]);
  })
}

export function changeColor(fetchColor) {
  let newColor = fetchColor.newColor
  if (fetchColor.alpha < 1) {
    newColor = fetchColor.newColor + (fetchColor.alpha * 255).toString(16)
  }

  if (fetchedColors.find(fColor => fColor.lastColor === fetchColor.newColor)) { return }
  const lastColor = fetchColor.lastColor
  fetchColor.lastColor = newColor
  return runFunctionInPage(replaceColor, [lastColor, newColor])
}

function replaceColor(oldColor, newColor) {
  const styles = document.getElementsByTagName('style')
  const needsToBeCheckedWithPostfix = !(/rgba?\(|hsla?\(|#([0-9a-fA-F]{2}){3,4}/ig.test(oldColor))
  const regexp = needsToBeCheckedWithPostfix ? `(${oldColor})([\\s;,}!\\)])`:
    oldColor.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    // .replace('0\\.','0?\\.')
    // .replace(',','\\s*,\\s*')
  const reg = new RegExp(regexp, 'ig')
  console.log(reg)
  Array.from(styles).forEach((style) => {
    let html = style.innerHTML
    if(needsToBeCheckedWithPostfix) {
      html = html.replace(reg, (first, oldColor, postfixChar) => {
        return newColor + postfixChar
      })
    } else {
      html = html.replace(reg, newColor)
    }
    style.innerHTML = html
  })
}