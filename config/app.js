const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('../config/winston');

module.exports = function(app) {
    // Beautify JSON response
    app.set('json spaces', 4);

    // To support JSON-encoded bodies
    app.use(bodyParser.json());

    // To support URL-encoded bodies
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    app.use(morgan('combined', { stream: logger.stream }));

    // Error handler
    app.use((err, req, res, next) => {
        // Set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // Add this line to include winston logging
        logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        // Render the error page
        res.status(err.status || 500);
        res.json({
            message: 'An error occurred',
        });
    });

    // Packages routs
    app.use('/packages', require('../routes/packages'));

    // Unhandled routes
    app.all('*', (req, res) => {
        res.status(404).send({message: 'Not Found'})
    });
};