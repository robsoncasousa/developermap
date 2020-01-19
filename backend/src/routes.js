const { Router } = require('express');
const routes = Router();
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

routes.post('/devs', DevController.store);
routes.get('/devs', DevController.index);
routes.put('/devs/:github_username', DevController.update);
routes.get('/devs/:github_username', DevController.show);
routes.delete('/devs/:github_username', DevController.destroy);

routes.get('/search', SearchController.index);

module.exports = routes;


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
