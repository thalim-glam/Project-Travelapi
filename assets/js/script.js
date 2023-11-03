//Weather API
var searchInput = document.querySelector(".search")
var searchButton = document.querySelector(".start-btn")
var temperature = document.querySelector(".temperature");
var summary = document.querySelector(".summary");
var loc = document.querySelector(".location");

var cityName = "";
const weatherKey = "bad2585150121c9b32104915c6e8ce3f"; // not best practice

function handleWeatherResponse(data) {
  console.log("grabbing new weather resp data");
  temperature.textContent = "Temperature: " + Math.floor(data.main.temp) + "°F";
  summary.textContent = "Weather Condition " + data.weather[0].description;
  loc.textContent = data.name + ", " + data.sys.country;
  document.querySelector("#current-weather").setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
}

function searchWeather(cityName) {
  console.log("searching weather")
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${weatherKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(handleWeatherResponse);
}
// Im gonna adjust to fit in ticketmaster city value

// Tasnim code above here

const TIX_KEY = "wmaoc2ZzZXf8620JjoaSV5OEFlvJNJ84" // not best practice
const TIX_BASE_PATH = `https://app.ticketmaster.com/discovery/v2/events.json`;

searchButton.addEventListener("click", function (event) {
  event.preventDefault()
  cityName = searchInput.value.trim()
  console.log("cityName : " + cityName)
  searchWeather(cityName)
  console.log("getting ticket data")
  getData(cityName)
})
// empty array because the api array to then reassign on line 105
// this array is causing the search input to not work properly because the list is going into the array
let eventList = [];
// console.log("empty array " + eventList)
let eventIncr = 0;
const leftArrowBtn = document.querySelector("#left-arrow");
const rightArrowBtn = document.querySelector("#right-arrow")

const leftIncr = function minusMinus() {
  // creating limit
  if (eventIncr > 0) {
    eventIncr--;
    console.log(eventIncr);
    showData();
  } else {
    eventIncr = 0
    console.log(eventIncr);
  }
}
leftArrowBtn.addEventListener('click', leftIncr)

const rightIncr = function plusPlus() {
  // creating a limit
  if (eventIncr < 19) {
    eventIncr++;
    console.log(eventIncr);
    showData();
  } else {
    eventIncr = 19
    console.log(eventIncr);
    // cursor change? or modal to tell user stop
  }
  /*
  if(eventIncr === String){
    JSON.parse(eventIncr);
  } else {eventIncr++}
  while (eventIncr === Number){
    // While this statement is true... 
    // convert to String
  }
  console.log(eventIncr)
  return(eventIncr);
  */
}
rightArrowBtn.addEventListener('click', rightIncr)


async function getData() {
  try {
    const tixUrl = TIX_BASE_PATH + `?city=${cityName}&apikey=${TIX_KEY}`
    console.log("tixurl data", tixUrl)
    const response = await fetch(tixUrl);
    // if theres an error then say not valid and show status
    if (response.ok) {
      console.log("if response ok")
      const data = await response.json();
      eventList = data._embedded.events;
      showData(eventList);
    }
  } catch (error) {
    console.warn(error.message);
  }
}

function showData(eventList) {
  console.log("event list", eventList)
  // title
  const eventData = eventList[eventIncr].name
  // const eventData = data._embedded.events[eventIncr].name
  //date
  const dateData = eventList[eventIncr].dates.start.localDate
  // const dateData = data._embedded.events[eventIncr].dates.start.localDate
  //time
  const timeData = eventList[eventIncr].dates.start.localTime
  // const timeData = data._embedded.events[eventIncr].dates.start.localTime
  // img jpg
  const picData = eventList[eventIncr].images[0].url
  //  const picData = data._embedded.events[eventIncr].images[0].url
  // buy ticket link
   const linkData = eventList[eventIncr].url
  // const linkData = data._embedded.events[eventIncr].images[0].url
  const eventContainer = document.getElementById('showEvents');
  // reset the propagation 
  eventContainer.innerHTML = "";
  const eventElement = document.createElement('div');
  eventElement.className = 'event';
  // shows picture, note .src
  const eventPic = document.createElement('img');
  eventPic.src = picData
  // shows title
  const eventTitle = document.createElement('h2');
  eventTitle.textContent = eventData
  // buy ticket link
  const eventLink = document.createElement('a');
  eventLink.href = linkData
  eventLink.textContent = eventLink.href
  //shows date in YYYY-MM-DD
  const eventDate = document.createElement('p');
  eventDate.textContent = dateData
  // shows time in military
  const eventTime = document.createElement('p');
  eventTime.textContent = timeData
  // append everything into the div as a child
  eventElement.appendChild(eventPic);
  eventElement.appendChild(eventTitle);
  eventElement.appendChild(eventLink);
  eventElement.appendChild(eventDate);
  eventElement.appendChild(eventTime);
  // finally we propagate into the container
  eventContainer.appendChild(eventElement);
}
