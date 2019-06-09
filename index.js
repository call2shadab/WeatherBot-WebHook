'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { WebhookClient } = require('dialogflow-fulfillment');
const app = express().use(bodyParser.json());
const axios = require('axios');
let api_key = process.env.APIkey;

app.set('port', process.env.PORT || 3000);

function get_weather(agent) {
    let city = agent.parameters['geo-city'];
    if (city != '') {
        let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${api_key}`
        return axios.get(url).then(res => {
            agent.add(`The temperature is ${res.data.main.temp} degree in ${city}`);
        }).catch(err => {
            agent.add('Sorry we are unable to process your request');
        });
    } else {
        agent.add('Which city?');
    }
}


app.post('/', (req,res) => {
    const agent = new WebhookClient({request: req, response: res});
    let intentMap = new Map();
    intentMap.set('Get Weather', get_weather);
    agent.handleRequest(intentMap);
});

app.listen(app.get('port'), ()=> {
    console.log('Server running at port: ', app.get('port'));
});
