const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');

// Define the custom settings for each transport (file, console)
const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

// Instantiate a new Winston Logger with the settings defined above
const logger = new createLogger({
    transports: [
        new transports.File(options.file),
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(options.console));
}

// Create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function(message, encoding) {
        // Use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;