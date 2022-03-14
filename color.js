import { toHex } from "./convert-color.js";

export let fetchedColors = []

export function convertAndSortColors(colorsList) {
  const colorsFreq = colorsList.reduce((obj, color) => {
    const hex = toHex(color.toLowerCase())
    if (!obj[hex]) obj[hex] = {count: 1, [color]: 1}
    else {
      obj[hex].count++
      obj[hex][color] = 1
    }
    return obj
  }, {})

  // sort colors by count
  const uniqueHexColors = Object
    .keys(colorsFreq)
    .sort((a, b) => colorsFreq[b].count - colorsFreq[a].count)

  uniqueHexColors.forEach((color) => {
    const [ alpha, alphaLessColor ] = getAlphaAndValidHEX(color)
    const unifiedColors = Object.keys(colorsFreq[color]).filter(c => c !== 'count')
    const colorObj = {
      // newColor,
      unifiedColors,
      lastColor: color,
      alpha, 
      hex: alphaLessColor, 
      origin: color
    }
    fetchedColors.push(colorObj)
  })
  return fetchedColors
}

// keeps the value between min and max
function limit(value, min, max) {
  return Math.min(Math.max(min, value), max)
}

// adds slider values to 
export function moveHSL(color, hsliChange) {
  const [cHue, cSaturation, cLigthness] = color
  const { hue, sat, light, inv } = hsliChange
  const newHue = (cHue + hue) % 360
  const newSaturation = limit(sat + cSaturation, 0, 100)
  const newLightness = limit(light + cLigthness, 0, 100)
  const invertedLightness = limit(inv - newLightness * (2 * inv/100 - 1), 0, 100)
  return [newHue, newSaturation, invertedLightness]
}

// convert hex to Hex and alpha e.g: #ffff => [1, #fff]
export function getAlphaAndValidHEX(hexColor) {
  if (hexColor.length === 9) {
    const opacity = parseInt(hexColor.slice(-2), 16) / 255
    const hex = hexColor.slice(0, 7)
    return [opacity, hex]
  } else {
    return [1, hexColor]
  }
}
