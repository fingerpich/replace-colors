import { hslaToHex, rgbaToHex, expandHex } from "./convert-color.js";


export let fetchedColors = []
let alphas = []
let colorsLookup = {}

export function load(colors) {
  colors.forEach((color) => {
    const [ alpha, alphaLessColor ] = getAlphaAndValidHEX(color)
    alphas.push(alpha)
    fetchedColors.push({
      lastColor: color,
      alpha, 
      hex: alphaLessColor, 
      origin: color})
    colorsLookup[color] = 1
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

// convert any color type to Hex and alpha
export function getAlphaAndValidHEX(color) {
  if (color.startsWith('rgba(')) {
    const hexA = rgbaToHex(color)
    const alpha = parseInt(hexA.slice(-2), 16)/255
    const hex = hexA.slice(0, 7)
    return [ alpha, hex ]
  } else if (color.startsWith('hsla(')) {
    const hexA = hslaToHex(color)
    const alpha = parseInt(hexA.slice(-2), 16)/255
    const hex = hexA.slice(0, 7)
    return [ alpha, hex ]
  } else if (color.startsWith('#')) {
    const c = expandHex(color)
    if (c.length === 9) {
      const opacity = parseInt(color.slice(-2), 16) / 255
      const hex = color.slice(0, 7)
      return [opacity, hex]
    }
    return [1, c]
  } else if (color.startsWith('rgb(')) {
    return [1, rgbToHex(color)]
  } else if (color.startsWith('hsl(')) {
    return [1, hslTextToHex(color)]
  }
}