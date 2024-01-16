const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const sequelize = require('./datasource/datasource')
const port = 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'CRUD API for codes for tomorrow',
        },
        servers: [{
            url: 'http://localhost:3000',
        }, ],
    },
    apis: ['./routes/*.js'],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/category', require('./routes/category.route'));
app.use('/', require('./routes/auth.route'))

app.get('/', (request, response) => {
    response.json({
        data: ' CRUD API for code for tomorrow'
    })
})


sequelize
    .sync({})
    .then(result => {
        console.log("Database connected");
        app.listen(port, () => {
            console.log(`App running on port ${port}.`)
        })
    })
    .catch(err => console.log(err));