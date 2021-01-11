"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nestjs_pino_logger_1 = require("nestjs-pino-logger");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
async function bootstrap() {
    const logger = new nestjs_pino_logger_1.Logger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.enableCors();
    const options = new swagger_1.DocumentBuilder()
        .setTitle('Caro game')
        .setDescription('The game API description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useStaticAssets(path_1.join(__dirname, '..', 'static'));
    await app.listen(4100);
}
bootstrap();
//# sourceMappingURL=main.js.map