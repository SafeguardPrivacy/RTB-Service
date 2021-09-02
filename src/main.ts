import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import {INestApplication} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {LoggerService} from './services/logger.service';

const API_DEFAULT_PORT = 3000;
const API_DEFAULT_PREFIX = '/';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new LoggerService(),
    });

    await createApp(app);
    await app.listen(process.env.API_PORT || API_DEFAULT_PORT);
}

export async function createApp(app: INestApplication): Promise<void> {
    app.enableCors({
        exposedHeaders: ['Token-Expired'],
    });

    app.setGlobalPrefix(process.env.API_PREFIX || API_DEFAULT_PREFIX);

    if (process.env.SWAGGER_ENABLE === 'true') {
        createSwagger(app);
    }

    app.use(bodyParser.json());
}

export function createSwagger(app: INestApplication): void {
    const options = new DocumentBuilder().setTitle('SafeguardPrivacy RTB Connector').build();
    const document = SwaggerModule.createDocument(app, options);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
    SwaggerModule.setup('/docs', app, document);
}

bootstrap();
