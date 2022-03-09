import { fetchedColors } from "./color.js";

export function initSliders(callback) {
  const hsli = { hue: 0, sat: 0, light: 0, inv: 0 };
  const bindSliderChange = (id, hsliProperty) => {
    document.getElementById(id).addEventListener('input', (e) => {
      hsli[hsliProperty] = +e.target.value
      callback(hsli)
    })
  }
  bindSliderChange('hue', 'hue')
  bindSliderChange('saturation', 'sat')
  bindSliderChange('lightness', 'light')
  bindSliderChange('invert', 'inv')
}

export const inputsList = []
export function updateInputs() {
  inputsList.forEach((input, index) => {
    input.value = fetchedColors[index].newColor
  })
}
export function createInputs(colorsList, callback) {
  let colorsListEl = document.getElementById("colorsList");
  colorsList.forEach((fetchColor, index) => {
    const input = ml('input', {type:'color', value: fetchColor.hex, oninput: (e) => {
      fetchColor.newColor = e.target.value
      callback(fetchColor)
    }})
    inputsList.push(input)
    const colorContainerEl = ml('label', {}, [
      ml('small', {}, fetchColor.origin),
      ml('span', {style: 'background:'+fetchColor.origin}),
      ml('div', {}, [
        ml('svg', {viewBox:"0 0 32 32"}, [
          ml('path', {d:"M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z"})
        ])
      ]),
      input,
    ])
    colorsListEl.appendChild(colorContainerEl)
  })
}


// https://idiallo.com/javascript/create-dom-elements-faster
function ml(tagName, props, nest) {
  var el = document.createElement(tagName);
  if(props) {
      for(var name in props) {
          if(name.indexOf("on") === 0) {
              el.addEventListener(name.substr(2).toLowerCase(), props[name], false)
          } else {
              el.setAttribute(name, props[name]);
          }
      }
  }
  if (!nest) {
      return el;
  }
  return nester(el, nest)
}

function nester(el, n) {
  if (typeof n === "string") {
      var t = document.createTextNode(n);
      el.appendChild(t);
  } else if (n instanceof Array) {
      for(var i = 0; i < n.length; i++) {
          if (typeof n[i] === "string") {
              var t = document.createTextNode(n[i]);
              el.appendChild(t);
          } else if (n[i] instanceof Node){
              el.appendChild(n[i]);
          }
      }
  } else if (n instanceof Node){
      el.appendChild(n)
  }
  return el;
}