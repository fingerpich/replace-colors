import {runFunctionInPage} from './extension.js'

export async function listColors() {
  let uniqueSortedColors;
  return runFunctionInPage(findColorsInStyle).then((colorsList) => {
    const colorUsage = colorsList.reduce((obj, color) => {
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

function findColorsInStyle() {
  const styles = document.getElementsByTagName('style')
  const colorsList = Array.from(styles).reduce((list, style) => {
    // const reg = /#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4})/g
    const reg = /(#(([0-9a-fA-F]{2}){3,4}|([0-9a-fA-F]){3,4}))|rgba?\([\d,\.\s]*\)|hsla\([\d,\%\.\s]*\)/g
    const colors = style.innerHTML.match(reg)
    return [...list, ...(colors || [])]
  }, [])

  return colorsList
}
