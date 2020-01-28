const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringasArray');

const { findConnections, sendMessage } = require('../websocket');

//index, store, show, update, destroy

module.exports = {
    async show(request, response) {
        const github_username = request.params.github_username;

        const dev = await Dev.findOne({
            github_username
        });

        response.json( { dev } );
    },

    async destroy(request, response) {
        const github_username = request.params.github_username;
        
        const dev = await Dev.findOne({
            github_username
        });

        if(dev) {

            await dev.remove();

        } else {
            return response.json({message: 'Usuário que está tentando deletar não existe!'});
        }
        
        return response.json({message: 'Usuário deletado com sucesso!'});
    },

    async update(request, response) {
        const github_username = request.params.github_username;
        const { techs, latitude, longitude, avatar_url, bio } = request.body;
        const techsArray = parseStringAsArray(techs);
        
        const dev = await Dev.findOne({
            github_username
        });

        if(dev) {
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev.techs = techsArray;
            dev.bio = bio;
            dev.avatar_url = avatar_url;
            dev.location = location;
            await dev.save();

        } else {
            return response.json({message: 'Usuário que está tentando atualizar não existe!'});
        }
        
        return response.json({ dev: dev });
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            
            const { name = login, avatar_url, bio } = apiResponse.data;
    
            const techsArray = parseStringAsArray(techs);
    
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
    
            dev = await Dev.create({
                github_username,
                name: name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );
            

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        } else {
            return response.json({message: 'Esse usuário já está cadastrado!'});
        }

        return response.json(dev);
    },

    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    }
}