import {runFunctionInPage} from './extension.js'
import { namedColors } from '../color.js'

export async function listColors() {
  let uniqueSortedColors;
  //[\\s;!,}]
  // const hexRegex = '#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})'
  const hexRegex = '#[0-9a-fA-F]{3,8}'
  const rgbaRegex = 'rgba?\\([\\d,\\.\\s]*\\)'
  const hslaRegex = 'hsla?\\([\\d,%\\.\\s]*\\)'
  const colorNamesRegex = Object
    .keys(namedColors)
    .map(name => name+'[\\s;!,}]')
    .join('|')
  const regexText = `${hexRegex}|${rgbaRegex}|${hslaRegex}|${colorNamesRegex}`
  return runFunctionInPage(findColorsInStyle, [regexText]).then((colorsList) => {
    const colorUsage = colorsList
      .map(color => color.replace(/[\s;!,}]/g, ''))
      .reduce((obj, color) => {
        if (!obj[color]) { obj[color] = 1}
        else { obj[color]++ }
        return obj
      }, {})

    // sort colors by the frequent
    uniqueSortedColors = Object
      .keys(colorUsage)
      .sort((a, b) => colorUsage[b] - colorUsage[a])
    return uniqueSortedColors
  })
}

function findColorsInStyle(regexText) {
  const styles = document.getElementsByTagName('style')
  const reg = new RegExp(regexText,'ig')
  const colorsList = Array.from(styles).reduce((list, style) => {
    const colors = style.innerHTML.match(reg)
    return [...list, ...(colors || [])]
  }, [])

  return colorsList
}

