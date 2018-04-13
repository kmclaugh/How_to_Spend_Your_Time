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

  function findColor(experience, saturation){
    var red = "hsl(0, "+saturation+"%, 50%)"
    var green = "hsl(120, "+saturation+"%, 25%)"
    var color = interpolate(red, green, experience/100);
    return color;
  }

  function findSize(importance){
    var fontSize = 32*(importance/100)+16
    return fontSize;
  }

  function findTransparency(remember){
    var transparency = remember/100;
    return transparency;
  }

  var importance = 50;
  var experience = 50;
  var remember = 50;
  var urgency = 50;
  var saturation = 100;

  var color = findColor(experience, saturation);
  var size = findSize(importance);
  var wordTransparency = findTransparency(remember);
  var containerTransparency = findTransparency(urgency);

  var currentWord = document.getElementsByClassName('word')[0];
  currentWord.style.fill = color;
  currentWord.style.stroke = color;
  currentWord.setAttribute("font-size", size);
  currentWord.setAttribute("fill-opacity", wordTransparency);
  var wordContainer = document.getElementsByClassName('wordContainer')[0];
  wordContainer.style.fill = "#ffff00";
  wordContainer.setAttribute("fill-opacity", containerTransparency);

  //importance slider
  var importanceSlider = document.getElementById("importanceRange");
  var importanceOutput = document.getElementById("imporanceValue");
  importanceOutput.innerHTML = importanceSlider.value;

  importanceSlider.oninput = function() {
    importanceOutput.innerHTML = this.value;
    importance = this.value;
    size = findSize(importance);
    currentWord.setAttribute("font-size", size);
  }

  //urgency slider
  var urgencySlider = document.getElementById("urgencyRange");
  var urgencyOutput = document.getElementById("urgencyValue");
  urgencyOutput.innerHTML = urgencySlider.value;

  urgencySlider.oninput = function() {
    urgencyOutput.innerHTML = this.value;
    var rawValue = this.value;

    urgency = rawValue/2;
    containerTransparency = findTransparency(urgency);
    wordContainer.setAttribute("fill-opacity", containerTransparency);
  }

  //experience slider
  var experienceSlider = document.getElementById("experienceRange");
  var experienceOutput = document.getElementById("experienceValue");
  experienceOutput.innerHTML = experienceSlider.value;

  experienceSlider.oninput = function() {
    experienceOutput.innerHTML = this.value;
    rawValue = this.value;
    experience = Number(rawValue) + 50
    color = findColor(experience, saturation);
    currentWord.style.fill = color;
    currentWord.style.stroke = color;
  }

  //remember slider
  var rememberSlider = document.getElementById("rememberRange");
  var rememberOutput = document.getElementById("rememberValue");
  rememberOutput.innerHTML = rememberSlider.value;

  rememberSlider.oninput = function() {
    rememberOutput.innerHTML = this.value;
    remember = this.value;
    wordTransparency = findTransparency(remember);
    currentWord.setAttribute("fill-opacity", wordTransparency);
  }




  //word input
  $('#currentActivityInput').on('input', function() {
    $('#currentOutput').text($(this).val());
  });

  var activitiesList = $("#activitiesList");
  $("#addActivity").on('click', function(){
    currentActivity = $("#currentActivity").html();
    activitiesList.prepend(currentActivity);
  })

});
