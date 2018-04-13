
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

class Activity {
  constructor(word, importance, urgency, experience, remember, active) {
    this.word = word;
    this.importance = importance;
    this.urgency = urgency;
    this.experience = experience;
    this.remember = remember;
    this.active = active;
    this.saturation = 100
    this.html = null;
  }

  setHTML(){
    if (this.active){
      this.html = $("#currentActivity").html();
      activitiesList.prepend(currentActivity);
    }
  }

  findColor(){
    var red = "hsl(0, "+this.saturation+"%, 50%)"
    var green = "hsl(120, "+this.saturation+"%, 25%)"
    this.color = interpolate(red, green, this.experience/100);
    return this.color;
  }

  findSize(){
    this.fontSize = 32*(this.importance/100)+16
    return this.fontSize;
  }

  findWordTransparency(){
    this.wordTransparency = this.remember/100;
    return this.wordTransparency;
  }

  findContainerTransparency(){
    this.containerTransparency = this.urgency/100;
    return this.containerTransparency;
  }

}

$(document).ready(function() {
  

  var savedActivities = [];
  var importance = 50;
  var experience = 50;
  var remember = 50;
  var urgency = 50;
  var saturation = 100;

  let currentActivity = new Activity(
    "Enter Activity",
    50,
    50,
    50,
    50,
    100,
    true,

  );

  var currentWord = document.getElementsByClassName('word')[0];
  var color = currentActivity.findColor()
  currentWord.style.fill = color;
  currentWord.style.stroke = color;
  currentWord.setAttribute("font-size", currentActivity.findSize());
  currentWord.setAttribute("fill-opacity", currentActivity.findWordTransparency());
  var wordContainer = document.getElementsByClassName('wordContainer')[0];
  wordContainer.style.fill = color;
  wordContainer.setAttribute("fill-opacity", currentActivity.findContainerTransparency());

  //importance slider
  var importanceSlider = document.getElementById("importanceRange");
  var importanceOutput = document.getElementById("imporanceValue");
  importanceOutput.innerHTML = importanceSlider.value;

  importanceSlider.oninput = function() {
    importanceOutput.innerHTML = this.value;
    currentActivity.importance = this.value;
    currentWord.setAttribute("font-size", currentActivity.findSize());
  }

  //urgency slider
  var urgencySlider = document.getElementById("urgencyRange");
  var urgencyOutput = document.getElementById("urgencyValue");
  urgencyOutput.innerHTML = urgencySlider.value;
  urgencySlider.oninput = function() {
    urgencyOutput.innerHTML = this.value;
    var rawValue = this.value;
    currentActivity.urgency = 50 - rawValue/2;
    wordContainer.setAttribute("fill-opacity", currentActivity.findContainerTransparency());
  }

  //experience slider
  var experienceSlider = document.getElementById("experienceRange");
  var experienceOutput = document.getElementById("experienceValue");
  experienceOutput.innerHTML = experienceSlider.value;
  experienceSlider.oninput = function() {
    experienceOutput.innerHTML = this.value;
    rawValue = this.value;
    currentActivity.experience = Number(rawValue) + 50
    color = currentActivity.findColor();
    currentWord.style.fill = color;
    currentWord.style.stroke = color;
    wordContainer.style.fill = color;
  }

  //remember slider
  var rememberSlider = document.getElementById("rememberRange");
  var rememberOutput = document.getElementById("rememberValue");
  rememberOutput.innerHTML = rememberSlider.value;

  rememberSlider.oninput = function() {
    rememberOutput.innerHTML = this.value;
    currentActivity.remember = this.value;
    currentWord.setAttribute("fill-opacity", currentActivity.findWordTransparency());
  }

  //word input
  $('#currentActivityInput').on('input', function() {
    currentActivity.word = $(this).val();
    $('#currentOutput').text(currentActivity.word);

  });

  var activitiesList = $("#activitiesList");
  $("#addActivity").on('click', function(){
    

    //word, importance, urgency, experience, remember, active
    let savedActivity = new Activity(
      currentActivity.word,
      currentActivity.importance,
      currentActivity.urgency,
      currentActivity.experience,
      currentActivity.remember,
      false
    );
    savedActivity.html = $("#currentActivity").html();

    savedActivities.push(savedActivity);
    activitiesList.prepend(savedActivity.html);
  })



});
