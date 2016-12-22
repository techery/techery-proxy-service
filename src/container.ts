/**
 * Temporary services container
 * TODO: Replace with IoC & providers
 */
import ElasticWrapper from './services/ElasticWrapper';
import ServiceRepository from './repositories/ServiceRepository';
import StubsRepository from './repositories/StubsRepository';
import config from './config';
import {Client} from 'elasticsearch';
import * as winston from 'winston';
import ServicesController from './controllers/ServicesController';
import StubsController from './controllers/StubsController';
import SessionsController from './controllers/SessionsController';
import SessionsRepository from './repositories/SessionsRepository';
import StubResolver from './proxy/StubResolver';
import ProxyHandler from './errors/ProxyHandler';
import AppHandler from './errors/AppHandler';

require('winston-daily-rotate-file');

let elasticsearch = new Client({
    host: 'localhost:9200',
    log: config.debug ? 'trace' : 'warning'
});
let elastic = new ElasticWrapper(elasticsearch, config.elasticsearch.index);
let serviceRepository = new ServiceRepository(elastic);
let stubsRepository = new StubsRepository(elastic);
let sessionRepository = new SessionsRepository(elastic);

let servicesController = new ServicesController(serviceRepository);
let stubsController = new StubsController(stubsRepository);
let sessionController = new SessionsController(sessionRepository);

let stubResolver = new StubResolver();

function initLogger(file: string): winston.LoggerInstance {
    const level = config.debug ? 'debug' : config.log.level;

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: level,
                colorize: true
            }),
            new winston.transports.DailyRotateFile({
                filename: file,
                datePattern: 'yyyy-MM-dd.',
                prepend: true,
                json: false,
                level: level
            })
        ]
    });
}

let appLogger = initLogger(config.log.app);
let proxyLogger = initLogger(config.log.proxy);

let appHandler = new AppHandler(appLogger);
let proxyHandler = new ProxyHandler(proxyLogger);

export {
    elastic,
    serviceRepository,
    stubsRepository,
    servicesController,
    stubsController,
    sessionController,
    stubResolver,
    appLogger,
    proxyLogger,
    appHandler,
    proxyHandler
};