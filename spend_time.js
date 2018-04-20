
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
  constructor(word, importance, urgency, experience, remember, active, chronology) {
    this.word = word;
    this.chronology = chronology;
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
    var vizValue = this.experience + 50;
    this.color = interpolate(red, green, vizValue/100);
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

  findContainerBorder(){
    this.containerBorder = 2*this.urgency;
    return this.containerBorder;
  }

  calculateEnjoymentScore(){
    this.enjoyment = Math.round(this.remember/10 * this.experience);
  }

  calculateProductivityScore(){
    this.productivity = Math.round(this.urgency/10 * this.importance);
  }

  calulcateFlourishingScore(){
    this.calculateEnjoymentScore();
    this.calculateProductivityScore();
    this.flourishing= Math.round(this.productivity + this.enjoyment);
  }

}

$(document).ready(function() {
  
  var currentSort = "chronology";

  var savedActivities = [];
  var importance = 50;
  var experience = 0;
  var remember = 50;
  var urgency = 2;
  var counter = 0;

  let currentActivity = new Activity(
    /*word, importance, urgency, experience, remember, active, counter*/
    "Enter Activity",
    importance,
    urgency,
    experience,
    remember,
    true,
    counter

  );

  var currentWord = document.getElementsByClassName('word')[0];
  var color = currentActivity.findColor()
  currentWord.style.fill = color;
  currentWord.style.stroke = color;
  currentWord.setAttribute("font-size", currentActivity.findSize());
  currentWord.setAttribute("fill-opacity", currentActivity.findWordTransparency());
  var wordContainer = document.getElementsByClassName('wordContainer')[0];
  wordContainer.style.fill = color;
  wordContainer.setAttribute("fill-opacity", currentActivity.findContainerBorder());

  //Scores
  currentActivity.calulcateFlourishingScore();
  var productivityValue = document.getElementById("productivityValue");
  productivityValue.innerHTML = currentActivity.productivity;
  var enjoymentValue = document.getElementById("enjoymentValue");
  enjoymentValue.innerHTML = currentActivity.enjoyment;
  var flourishingValue = document.getElementById("flourishingValue");
  flourishingValue.innerHTML = currentActivity.flourishing;

  //importance slider
  var importanceSlider = document.getElementById("importanceRange");
  var importanceOutput = document.getElementById("imporanceValue");
  importanceOutput.innerHTML = importanceSlider.value;

  importanceSlider.oninput = function() {
    importanceOutput.innerHTML = this.value;
    currentActivity.importance = Number(this.value);
    currentWord.setAttribute("font-size", currentActivity.findSize());
    currentActivity.calulcateFlourishingScore();
    productivityValue.innerHTML = currentActivity.productivity;
    flourishingValue.innerHTML = currentActivity.flourishing;
  }

  //urgency slider
  var urgencySlider = document.getElementById("urgencyRange");
  var urgencyOutput = document.getElementById("urgencyValue");
  urgencyOutput.innerHTML = urgencySlider.value;
  urgencySlider.oninput = function() {
    urgencyOutput.innerHTML = this.value;
    currentActivity.urgency = this.value;
    wordContainer.setAttribute("style", "stroke-width:"+currentActivity.findContainerBorder());
    currentActivity.calulcateFlourishingScore();
    productivityValue.innerHTML = currentActivity.productivity;
    flourishingValue.innerHTML = currentActivity.flourishing;
  }

  //experience slider
  var experienceSlider = document.getElementById("experienceRange");
  var experienceOutput = document.getElementById("experienceValue");
  experienceOutput.innerHTML = experienceSlider.value;
  experienceSlider.oninput = function() {
    experienceOutput.innerHTML = this.value;
    currentActivity.experience = Number(this.value);
    color = currentActivity.findColor();
    currentWord.style.fill = color;
    currentWord.style.stroke = color;
    wordContainer.style.fill = color;
    currentActivity.calulcateFlourishingScore();
    enjoymentValue.innerHTML = currentActivity.enjoyment;
    flourishingValue.innerHTML = currentActivity.flourishing;
  }

  //remember slider
  var rememberSlider = document.getElementById("rememberRange");
  var rememberOutput = document.getElementById("rememberValue");
  rememberOutput.innerHTML = rememberSlider.value;

  rememberSlider.oninput = function() {
    rememberOutput.innerHTML = this.value;
    currentActivity.remember = this.value;
    currentWord.setAttribute("fill-opacity", currentActivity.findWordTransparency());
    currentActivity.calulcateFlourishingScore();
    enjoymentValue.innerHTML = currentActivity.enjoyment;
    flourishingValue.innerHTML = currentActivity.flourishing;
  }

  //word input
  $('#currentActivityInput').on('input', function() {
    currentActivity.word = $(this).val();
    $('#currentOutput').text(currentActivity.word);

  });

  $("#addActivity").on('click', function(){
    
    //word, importance, urgency, experience, remember, active
    let savedActivity = new Activity(
      currentActivity.word,
      currentActivity.importance,
      currentActivity.urgency,
      currentActivity.experience,
      currentActivity.remember,
      false,
      counter
    );
    savedActivity.html = $("#currentActivity").html();

    savedActivities.push(savedActivity);
    sortActivities(savedActivities, currentSort, activitiesList)

    counter += 1;
  })

  $("#sortOrder").change(function() {
    currentSort = $(this).val();
    sortActivities(savedActivities, currentSort, activitiesList)
  });

function sortActivities(savedActivities, currentSort, activitiesList){
  /*Sorts the activites accord to the sort order given */
  savedActivities = _.orderBy(savedActivities, [currentSort], ['desc']);
  var newHTML = _.map(savedActivities, 'html').join("");
  $("#activitiesList").html(newHTML)


}


});
