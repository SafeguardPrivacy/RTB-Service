"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSwagger = exports.createApp = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const fs = require("fs");
const bodyParser = require("body-parser");
const swagger_1 = require("@nestjs/swagger");
const logger_service_1 = require("./services/logger.service");
const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/';
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: new logger_service_1.LoggerService(),
    });
    await createApp(app);
    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}
async function createApp(app) {
    app.enableCors({
        exposedHeaders: ['Token-Expired'],
    });
    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);
    if (process.env.SWAGGER_ENABLE === 'true') {
        createSwagger(app);
    }
    app.use(bodyParser.json());
}
exports.createApp = createApp;
function createSwagger(app) {
    const options = new swagger_1.DocumentBuilder().setTitle('SafeguardPrivacy RTB Connector').build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
    swagger_1.SwaggerModule.setup('/docs', app, document);
}
exports.createSwagger = createSwagger;
bootstrap();
//# sourceMappingURL=main.js.map