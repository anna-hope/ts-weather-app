type Weather = {
    forecast: string,
    location?: string,
    address?: string,
    error?: string
}

const fetchWeather = async (address: string): Promise<Weather>  => {
    const response = await fetch('/weather?address=' + address);
    const responseData = await response.json();
    return responseData;
}

const fetchWeatherLatLong = async (latitude: number, longitude: number): 
Promise<Weather> => {
    const response = await fetch(`/weather?latitude=${latitude}&longitude=${longitude}`);
    const responseData = await response.json();
    return responseData;
}

window.addEventListener('load', () => {
    const weatherForm = document.querySelector('form');
    const inputField = weatherForm.querySelector('input');

    const messageOne = document.getElementById('message-1');
    const messageTwo = document.getElementById('message-2');

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        fetchWeatherLatLong(latitude, longitude).then((weather) => {
            messageOne.textContent = 'Current location';
            messageTwo.textContent = weather.forecast;
        })
    })

    weatherForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const address = inputField.value;

        messageOne.textContent = 'Loading...';
        messageTwo.textContent = '';

        fetchWeather(address).then((responseData: Weather) => {
            if (responseData.error) {
                return messageOne.textContent = responseData.error;
            }

            messageOne.textContent = responseData.location;
            messageTwo.textContent = responseData.forecast;
        }, (error) => console.log(error)
        );
    });
});

