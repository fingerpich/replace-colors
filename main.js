import { onExtensionLoaded } from "./action-on-page/extension.js";
import { hexToHsl, hslToHex } from "./convert-color.js";
import { createInputs, updateInputs, initSliders } from "./handleDom.js"
import { listColors } from "./action-on-page/fetch-colors.js"
import { changeColor, changeColorsList } from "./action-on-page/replace-colors.js"
import * as coloring from './color.js'

onExtensionLoaded(() => {
  listColors().then((colors) => {
    coloring.load(colors)
    createInputs(coloring.fetchedColors, changeColor)
    initSliders((hsli) => {
      applyHSLChanges(hsli)
      changeColorsList()
      updateInputs()
    })
  })
})

// apply slider values to each color converted to hsl
export function applyHSLChanges(hsli) {
  return coloring.fetchedColors.forEach((fetchColor) => {
    const convertedToHSL = hexToHsl(fetchColor.hex)
    const [hue, saturation, lightness] = coloring.moveHSL(convertedToHSL, hsli)
    fetchColor.newColor = hslToHex(hue, saturation, lightness)
  })
}


