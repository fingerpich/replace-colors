export function rgbaToHex(color) {
  const match = color.match(/^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16).padStart(2, '0')+ //R
    (+match[2]).toString(16).padStart(2, '0')+ //G
    (+match[3]).toString(16).padStart(2, '0')+ //B
    (Math.round(+match[4]*255).toString(16)).padStart(2, '0') //A
  :'#000000'
}
export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([0\.]{0,2}\d*)?$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: +result[4],
  } : null;
}


export function rgbToHex(color) {
  const match = color.match(/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16).padStart(2, '0')+ //R
    (+match[2]).toString(16).padStart(2, '0')+ //G
    (+match[3]).toString(16).padStart(2, '0') //B
  :'#000000'
}

export function expandHex(color) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  return color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i, (m, r, g, b, a='') => '#' + r + r + g + g + b + b + a + a)
}

export function hslaToHex(color) {
  const match = color.match(/^hsla\((\d{1,3}),\s*(\d{1,3})%?,\s*(\d{1,3})%?,\s*([\d\.]*)\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16).padStart(2, '0')+ //R
    (+match[2]).toString(16).padStart(2, '0')+ //G
    (+match[3]).toString(16).padStart(2, '0')+ //B
    (Math.round(+match[4]*255).toString(16)).padStart(2, '0') //A
  :'#000000'
}
export function hslTextToHex(color) {
  const match = color.match(/^hsl\((\d{1,3}),\s*(\d{1,3})%?,\s*(\d{1,3})%?\)$/);
  return match ?
    '#'+
    (+match[1]).toString(16).padStart(2, '0')+ //R
    (+match[2]).toString(16).padStart(2, '0')+ //G
    (+match[3]).toString(16).padStart(2, '0') //B
  :'#000000'
}

export function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToHsl(hex) {
  const {r, g, b} = hexToRgb(hex)
  const hsl = rgbToHsl(r, g, b)
  return [hsl[0]*360, hsl[1]*100, hsl[2]*100]
}
export function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h, s, l];
}

