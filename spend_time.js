/**
 * A simple color interpolator.
 * Parses a `from` and `to` HSL string in the format
 * `hsl(200, 100%, 50%)` and a step value between 0 and 1
 * and returns a new HSL string.
 * An optional `precision` value may be provided for the
 * new HSL string
 *
 * @param {string} from
 * @param {string} to
 * @param {number} step
 * @param {precision} number
 */

$(document).ready(function() {
  var regex = /^hsl\(\s*([\-|\d|\.]*)\s*,\s*([\d|\.]*)%\s*,\s*([\d|\.]*)%/;
  function interpolate (start, end, step, precision) {
    precision = precision != null ? precision : 0;
    start = start.match(regex);
    end = end.match(regex);
    var
      startH = +start[1],
      startS = +start[2],
      startL = +start[3],
      endH   = +end[1],
      endS   = +end[2],
      endL   = +end[3];

    var
      h = (startH - (startH - endH) * step).toFixed(precision),
      s = (startS - (startS - endS) * step).toFixed(precision),
      l = (startL - (startL - endL) * step).toFixed(precision);

    return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  }

  function findColor(importance, experience){
    var red = "hsl(0, "+experience+"%, 50%)"
    var green = "hsl(120, "+experience+"%, 25%)"
    var color = interpolate(red, green, importance/100);
    return color;
  }

  function findSize(urgency){
    var fontSize = 32*(urgency/100)+16
    return fontSize;
  }

  function findTransparency(remember){
    var transparency = remember/100;
    return transparency;
  }

  var importance = 90;
  var urgency = 100;
  var remember = 100;
  var experience = 80;

  var color = findColor(importance, experience);
  var size = findSize(urgency);
  var transparency = findTransparency(remember);

  var currentWord = document.getElementsByClassName('word')[0];
  currentWord.style.fill = color;
  currentWord.style.stroke = color;
  currentWord.setAttribute("font-size", size);
  currentWord.setAttribute("fill-opacity", transparency);

  //importance slider

  var importanceSlider = document.getElementById("importanceRange");
  var importanceOutput = document.getElementById("imporanceValue");
  importanceOutput.innerHTML = importanceSlider.value;

  importanceSlider.oninput = function() {
    importanceOutput.innerHTML = this.value;
      importance = this.value;
      color = findColor(importance, experience);
      currentWord.style.fill = color;
      currentWord.style.stroke = color;
  }

});
