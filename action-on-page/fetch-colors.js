import { runFunctionInPage } from './extension.js'
import { getColorRegex, setOriginCssText } from '../css.js'

export async function loadAllCssAndColors() {
  const reg = getColorRegex()
  return runFunctionInPage(getStylesText).then((cssText) => {
    setOriginCssText(cssText)
    const colorsList = cssText.match(reg)
      .map(color => color.replace(/[\s;!,}]$/g, '').replace(/^[\s,(:]/g, ''))
    return colorsList
  })
}

async function getStylesText() {
  let cssText = '';
  for (let style of document.styleSheets) {
    if (!style instanceof CSSStyleSheet) continue
    try {
      [...style.cssRules].forEach(r => {
        cssText += r.cssText + ' '
      })
    } catch(e) {
      await new Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.open('GET', style.href)
        client.onreadystatechange = function() {
          cssText += client.responseText
          resolve()
        }
        client.send()
      })
    }
  }
  return cssText
}

