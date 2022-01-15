type Weather = {
    location: string,
    address: string,
    forecast: string,
    error?: string
}

const fetchWeather = async (address: string): Promise<Weather>  => {
    const response = await fetch('/weather?address=' + address);
    const responseData = await response.json();
    return responseData;
}

window.addEventListener('load', () => {
    const weatherForm = document.querySelector('form');
    const inputField = weatherForm.querySelector('input');

    const messageOne = document.getElementById('message-1');
    const messageTwo = document.getElementById('message-2');

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

