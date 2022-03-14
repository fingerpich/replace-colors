import { onExtensionLoaded } from "./action-on-page/extension.js";
import { hexToHsl, hslToHex } from "./convert-color.js";
import { createInputs, updateInputs, initSliders } from "./handleDom.js"
import { loadAllCssAndColors } from "./action-on-page/fetch-colors.js"
import { setOriginCssText, replaceAllColors, getOriginCssText } from "./css.js"
import { changeAColor, changeColorsList } from "./action-on-page/replace-colors.js"
import * as coloring from './color.js'

onExtensionLoaded(() => {
  loadAllCssAndColors().then((colors) => {
    coloring.convertAndSortColors(colors)
    
    const replaceObj = coloring.fetchedColors.reduce((obj, colorObj) => {
      colorObj.unifiedColors.forEach(colorText => {
        obj[colorText] = colorObj.lastColor
      })
      return obj
    }, {})
    setOriginCssText(replaceAllColors(getOriginCssText(), replaceObj))

    createInputs(coloring.fetchedColors, colorObj => {
      changeAColor(colorObj)
    })
    initSliders((hsli) => {
      applyHSLChanges(hsli)
      changeColorsList()
      updateInputs()
    })
  })
})

// apply slider values to each color converted to hsl
export function applyHSLChanges(hsli) {
  return coloring.fetchedColors.forEach((colorObj) => {
    const convertedToHSL = hexToHsl(colorObj.hex)
    const [hue, saturation, lightness] = coloring.moveHSL(convertedToHSL, hsli)
    colorObj.newColor = hslToHex(hue, saturation, lightness)
  })
}


