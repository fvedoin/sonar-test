"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./utils/http-exception.filter.");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('v2');
    app.enableCors({
        methods: '*',
        origin: process.env.CORS_ORIGIN || 'https://localhost:3000',
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API Spinon')
        .setDescription('A API de energia')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('v2/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT || 3333);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map