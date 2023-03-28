const API_KEY = "ef0d8c5f443905e270c6f8df2296b598";


const back = document.querySelector(".backBtn");
const input = document.querySelector(".search");
const submit = document.querySelector(".submit-btn");
const locationSwitcher = document.querySelector(".location-switcher");
const forecastDataContainer = document.querySelector(".forecast-data");
const fahernheitSwitcher = document.querySelector(".fahrenheit-switcher");
const celsiusSwitcher = document.querySelector(".celcius-switcher");
let fahrenheitData, celsiusData;

let inputValue;
let isFahrenheit = false;
const eventListenerCallback = (event) => {
    inputValue = event.target.value;
}
const performRequest = (city, units) => {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=${units}`);
};
const fillWeatherValues = (weatherData) => {
    const locationName = document.querySelector(".city");
    const cityName = weatherData.name;
    locationName.innerHTML = cityName;

    const date = document.querySelector(".days-month-number");
    let now = new Date();
    date.innerHTML = now.toLocaleDateString("en-US", { weekday: "long" }) + " " + now.toLocaleDateString("en-US", { month: "short" }) + " " + now.getDate();
    const time = document.querySelector(".time");
    let currentMinutes = now.getMinutes();
    if (currentMinutes.toString().length === 1) {
        currentMinutes = `0${currentMinutes}`;
    }
    time.innerHTML = `${now.getHours()}:${currentMinutes}`;
    const tempNow = document.querySelector(".temp-now");
    const temp = weatherData.main.temp
    tempNow.innerHTML = `${temp.toFixed(0)}&deg`;


    const feels = document.querySelector(".feels-like");
    const infoFeels = weatherData.main.feels_like;
    feels.innerHTML = `${infoFeels.toFixed(0)}&deg`;
    const wet = document.querySelector(".weather-humidity");
    const humidityweather = weatherData.main.humidity;
    wet.innerHTML = humidityweather.toFixed(0);

    const weatherds = document.querySelector(".weather-description");
    const infoDescription = weatherData.weather[0].description;
    weatherds.innerHTML = infoDescription;
}
const createError = (errorMessage, changeMessage = false, parentNode = locationSwitcher) => {
    const errorNode = document.querySelector('.no-city-error');
    if (changeMessage) {
        errorNode.innerHTML = errorMessage;
    }
    if (errorNode) return;
    const error = document.createElement('p');
    error.className = "no-city-error";
    error.innerHTML = errorMessage
    error.style.color = "red";
    parentNode.insertBefore(error, submit);
}
input.addEventListener('keyup', eventListenerCallback);
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        submit.click();
    }

});
submit.addEventListener('click', () => {
    const errorNode = document.querySelector('.no-city-error');
    const hasError = !!errorNode;

    if (hasError && errorNode.innerHTML === "City not found" && (!inputValue || !inputValue.trim())) {
        createError("Please enter a city", true);
    }

    if (hasError && (!inputValue || !inputValue.trim())) return;

    if ((!inputValue && !hasError) || (inputValue && !inputValue.trim() && !hasError)) {
        createError("Please enter a city");
        return;
    }
    const promiseArr = [performRequest(inputValue, "metric"), performRequest(inputValue, "imperial")];
    Promise.all(promiseArr)
        .then(([celsiusData, fahernheitData]) => {
            return Promise.all([celsiusData.json(), fahernheitData.json()])
        })
        .then(([celsiusDataParsed, fahernheitDataParsed]) => {
            if (celsiusDataParsed.cod === '404' || fahernheitDataParsed.cod === '404') {
                if (errorNode && errorNode.innerHTML === "Please enter a city") {
                    createError("City not found", true);
                }
                let errMsg = celsiusDataParsed.message || fahernheitDataParsed.message;
                const message = errMsg.split("")
                    .map((char, idx) => {
                        if (idx === 0) return char.toUpperCase();
                        return char;
                    })
                    .join("");
                createError(message);
                return;
            }

            locationSwitcher.style.display = "none";
            forecastDataContainer.style.display = "block";
            isFahrenheit ? fillWeatherValues(fahernheitDataParsed) : fillWeatherValues(celsiusDataParsed);
            fahrenheitData = fahernheitDataParsed;
            celsiusData = celsiusDataParsed;
            back.style.display = "block";

        });

    back.addEventListener("click", () => {
        back.style.display = "none";
        forecastDataContainer.style.display = "none";
        locationSwitcher.style.display = "flex";
        input.value = inputValue = "";
    })
});

[fahernheitSwitcher, celsiusSwitcher].forEach(switcher => {
    switcher.addEventListener('click', () => {
        isFahrenheit = !isFahrenheit;
        isFahrenheit ? fillWeatherValues(fahrenheitData) : fillWeatherValues(celsiusData);
    })
})
