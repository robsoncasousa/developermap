const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect('mongodb+srv://robson:robson@cluster0-epjw8.mongodb.net/developermap?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json()); //precisa vir antes das rotas
app.use(routes);

app.listen(3333);