const searchBtn = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const hours_placeholder = document.querySelector('#hours');
const minutes_placeholder = document.querySelector('#minutes');
const date_placeholder = document.querySelector('#date');
const cityName = document.querySelector('.city-name');
const weatherCard = document.querySelector('.weather-card');
const ico = document.querySelector('.weather-ico')
const weatherDescription = document.querySelector('.weather-desc')
const temp = document.querySelector('#temp');
const wind = document.querySelector('#wind');
const pressure = document.querySelector('#pressure');


searchBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    const city = searchInput.value
    
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=your_openweathermap_API_key`)   // input your own API key
    .then(res => res.json())
    .then(data => {
        // Geocoding the searched place
        const lat = data[0].lat
        const lon = data[0].lon
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=your_openweathermap_API_key&units=metric`) // input your own API key
        .then(res => res.json())
        .then(data => {
            // creating new date object with current time
            const currentDate = new Date(); 

            // return number of miliseconds since the start of the epoch
            const time = currentDate.getTime(); 

            // getTimezoneoffset returns difference between local time and UTC time in minutes (GMT +1 = -60), converting it to miliseconds
            const localOffset = currentDate.getTimezoneOffset() * 60000 

            // value in miliseconds of current time and its timezone 
            // (also in miliseconds, that's why it needed to be converted by multiplying by 60000, 
            // there are 60000 miliseconds in one minute)
            const utclocal = time + localOffset 

            // getting current time's offset in hours (minutes divided by 60 - converting to hours)
            const LocalOffsetInHours = currentDate.getTimezoneOffset() / 60 


            const thereOffset = data.timezone / 3600 // getting UTC offset in hours
            const offsetBetweenPlaces = thereOffset + LocalOffsetInHours // getting an offset between local place and searched place
            const searchedPlaceTime = new Date(utclocal + (3600000 * offsetBetweenPlaces) + 3600000);


            // splitting datetime into time and date
            const date = searchedPlaceTime.toLocaleString().split(", ");    // time in string format
            const date_segment = date[0]
            const time_segment = date[1]
            const hours = time_segment.slice(0,2)       // getting hours from time segment
            const minutes = time_segment.slice(3,5)     // getting minutes from time segment

            cityName.innerHTML = searchInput.value.charAt(0).toUpperCase() + searchInput.value.slice(1);
            hours_placeholder.innerHTML = hours
            minutes_placeholder.innerHTML = minutes
            date_placeholder.innerHTML = date_segment
            weatherDescription.innerHTML = data.weather[0].description;
            temp.innerHTML = Math.ceil(data.main.temp)
            wind.innerHTML = data.wind.speed
            pressure.innerHTML = data.main.pressure
            // console.log(data)
            ico.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            weatherCard.classList.remove("weather-card-hidden")     // only after all of the data is present, make the weather card visible
        })
    }).catch(() => {
        alert("Sorry, no such city found. Please try again.")
    });
});