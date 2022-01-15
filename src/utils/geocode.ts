import dotenv from "dotenv";
import superagent = require("superagent");

dotenv.config();

const mapboxApiKey = process.env.MAPBOX_API_KEY;
const mapboxUrlPrefix = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';


export interface Geocode {
    latitude: number;
    longitude: number;
    location: string;
}

export const getGeocode = async (address: string): Promise<Geocode> => {
    const mapboxUrl = new URL(address + '.json', mapboxUrlPrefix).toString();
    let response: superagent.Response;
    response = await superagent.get(mapboxUrl).query({
        access_token: mapboxApiKey,
        limit: 1
    });
    

    const { body } = response;
    const features: any[] | undefined = body.features;
    if (!body.features) {
        throw new Error("unknown error");
    } 
    
    if (features.length === 0) {
        throw new Error("could not find location");
    }

    const [longitude, latitude]: [number, number] = features[0].center;
    const location: string = features[0].place_name;
    return { latitude, longitude, location };
}