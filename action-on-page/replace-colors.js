import { runFunctionInPage } from "./extension.js"
import { fetchedColors } from "../color.js"
import { numberToHex2 } from "../convert-color.js";
import { getOriginCssText, getTempCssText, replaceAColor, replaceAllColors, setTempCssText } from "../css.js";

export function changeColorsList() {
  const lookup = {} // prevents colors to be duplicated
  const newColors = fetchedColors.map(colorObj => {
    const c = (colorObj.alpha < 1) ? 
      (colorObj.newColor + numberToHex2(Math.round(colorObj.alpha * 255))) : 
      colorObj.newColor
    if (!lookup[c]) { lookup[c] = 1; }
    else { return colorObj.lastColor }
    return c
  })
  const colorsMap = newColors.reduce((obj, c, index) => {
    obj[fetchedColors[index].origin] = c
    fetchedColors[index].lastColor = c
    return obj
  }, {})
  const newCss = replaceAllColors(getOriginCssText(), colorsMap)
  setTempCssText(newCss)
  return runFunctionInPage(upsertColorStyle, [newCss])
}

export function changeAColor(colorObj) {
  let newColor = colorObj.newColor
  if (colorObj.alpha < 1) {
    newColor = colorObj.newColor + numberToHex2(colorObj.alpha * 255)
  }
  
  if (fetchedColors.find(thisColorObj => thisColorObj.lastColor === colorObj.newColor)) { return }
  const newCss = replaceAColor(getTempCssText(), colorObj.lastColor, newColor)
  setTempCssText(newCss)
  colorObj.lastColor = newColor
  return runFunctionInPage(upsertColorStyle, [newCss])
}

function upsertColorStyle(cssText) {
  let ourStyle = document.getElementById('changedStyle')
  if (!ourStyle) {
    ourStyle = document.createElement('style')
    ourStyle.id = 'changedStyle'
    document.body.appendChild(ourStyle)
  }
  ourStyle.innerHTML = cssText
}