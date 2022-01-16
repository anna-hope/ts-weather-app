import dotenv from 'dotenv';
import superagent = require("superagent");

dotenv.config();

type CurrentWeather = {
    observation_time: string,
    temperature: number,
    weather_code: number,
    weather_icons: string[],
    weather_descriptions: string[],
    wind_speed: number,
    wind_degree: number,
    wind_dir: string,
    pressure: number,
    precip: number,
    humidity: number,
    cloudcover: number,
    feelslike: number,
    uv_index: number,
    visibility: number,
    is_day: string
}

export const getForecast = async (latitude: number, longitude: number): Promise<string> => {
    const url = 'http://api.weatherstack.com/current';
    const apiKey = process.env.WEATHERSTACK_API_KEY;
    const locationQuery = `${latitude},${longitude}`;

    const { body } = await superagent.get(url).query({ 
        access_key: apiKey,
        query: locationQuery
    });

    if (body.error) {
        debugger;
        throw new Error("unable to find location");
    }

    const currentWeather: CurrentWeather = body.current;
    const { temperature: currentTemp, feelslike: feelsLike, weather_descriptions, precip } = currentWeather;
    const weatherDescription = weather_descriptions[0];
    const forecast = `${weatherDescription}. It is currently ${currentTemp}. It feels like ${feelsLike}.
    Chance of precipitation: ${precip * 100}%`;
    return forecast;
}