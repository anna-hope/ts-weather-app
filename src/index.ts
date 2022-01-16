import dotenv from "dotenv";
import path = require("path");
import express = require("express");
import hbs = require('hbs');
import { getForecast } from "./utils/forecast";
import { getGeocode, Geocode } from "./utils/geocode";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// set up handlebars 
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// paths for express config
const staticPath = path.join(__dirname, '..', 'public');
app.use(express.static(staticPath));

interface PageData {
    title: string;
    name: string;
    message?: string
}

const getPageData = (title: string, message?: string, name: string='anna'): PageData => {
    return {title, message, name}
}

app.get('/', (req, res) => {
    res.render('index', getPageData('weather', 'get you some weather'));
})

app.get('/about', (req, res) => {
    res.render('about', getPageData('about'));
})

app.get('/help', (req, res) => {
    res.render('help', getPageData('help page', 'Help message'));
})

const getForecastResponse = async (address: string): Promise<any> => {
    let geocode: Geocode;
    let forecast: string;

    try {
        geocode = await getGeocode(address);
    } catch (e) {
        return { error: e.message };
    }

    const { latitude, longitude, location } = geocode;
    try {
        forecast = await getForecast(latitude, longitude);
    } catch (e) {
        return { error: e.message };
    }

    return { location, address, forecast };
}


app.get('/weather', (req, res) => {
    if (req.query.address) {
        let address: string;

        if (req.query.address instanceof Array) {
            address = req.query.address[0] as string;
        } else {
            address = req.query.address as string;
        }

        return getForecastResponse(address)
        .then((response) => res.send(response)); 

    } else if (req.query.latitude && req.query.longitude) {
        let latitudeString: string;
        if (req.query.latitude instanceof Array) {
            latitudeString = req.query.latitude[0] as string;
        } else {
            latitudeString = req.query.latitude as string;
        }

        let longitudeString: string;
        if (req.query.longitude instanceof Array) {
            longitudeString = req.query.longitude[0] as string;
        } else {
            longitudeString = req.query.longitude as string;
        }

        const latitude = Number.parseFloat(latitudeString);
        const longitude = Number.parseFloat(longitudeString);

        return getForecast(latitude, longitude)
        .then((forecast) => res.send({ forecast }),
        (reason) => res.send({ error: reason }));
    } else {
        return res.send({
            error: 'you must provide an address'
        });
    }

})

app.get('/help/*', (req, res) => {
    res.status(404).render('help-404', getPageData('not found', 'help article not found'));
})

app.get('*', (req, res) => {
    res.status(404).render('404', getPageData('404 Not Found', 'page not found'));
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

