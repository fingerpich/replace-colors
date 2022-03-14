
import { namedColors } from './convert-color.js'

let extractedCssText = ''
export function getOriginCssText() {
  return extractedCssText
}
export function setOriginCssText(css) {
  extractedCssText = css
  tempCssText = css
}

let tempCssText
export function setTempCssText(css) {
  tempCssText = css
}
export function getTempCssText(css) {
  return tempCssText
}

export function replaceAColor(cssText, oldColor, newColor) {
  return cssText.replaceAll(oldColor, newColor)
}
export function replaceAllHexColors(cssText, replaceObj) {
  const hexRegex = '#[0-9a-fA-F]{6,8}'
  const regex = new RegExp(hexRegex,'ig')
  const newCssText = cssText.replace(regex, (match) => {
    return replaceObj[match] || match
  })
  return newCssText
}

export function replaceAllColors(cssText, replaceObj) {
  const regex = getColorRegex()
  const newCssText = cssText.replace(regex, (match) => {
    const color = match.replace(/[\s;!,}]$/g, '').replace(/^[\s,(:]/g, '')
    if (!replaceObj[color]) {
      console.error(color + ' is not a match')
    }
    return replaceObj[color] || match
  })
  return newCssText
}

export function getColorRegex() {
  const hexRegex = '#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})[\\s;!,}]'
  const rgbaRegex = 'rgba?\\([\\d,\\.\\s]*\\)'
  const hslaRegex = 'hsla?\\([\\d,%\\.\\s]*\\)'
  const colorNamesRegex = Object
    .keys(namedColors)
    .map(name => '[\\s,(:]'+name+'[\\s;!,}]')
    .join('|')
  const regexText = `${hexRegex}|${rgbaRegex}|${hslaRegex}|${colorNamesRegex}`
  const reg = new RegExp(regexText,'ig')
  return reg
}