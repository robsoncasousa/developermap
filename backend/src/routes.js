const { Router } = require('express');
const axios = require('axios');
const routes = Router();
const Dev = require('./models/Dev');

//get, post, put, delete

//Query Params:  request.query (consulta, ordenação)
//Route Params: request.params (Identificar um recurso para alteração ou remoção)
//Body: 

//app.delete('/users', (request, response) => {
//    console.log(request.query);
//    return response.json({ message: 'E aí mano, blz?' });
//});

//app.delete('/users/:id', (request, response) => {
//    console.log(request.params);
//    return response.json({ message: 'E aí mano, blz?' });
//});

// MongoDB (Não-relacional)

routes.post('/devs', async (request, response) => {
    const { github_username, techs, latitude, longitude } = request.body;

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
    const { name = login, avatar_url, bio } = apiResponse.data;

    const techsArray = techs.split(',').map(tech => tech.trim());

    const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
    };

    const dev = await Dev.create({
        github_username,
        name: name,
        avatar_url,
        bio,
        techs: techsArray,
        location
    });

    return response.json(dev);
});

module.exports = routes;