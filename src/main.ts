import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ResponseTransformInterceptor } from './response/response.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import the correct type

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Nest js App')
    .setDescription('API Details')
    .setVersion(`App Version: ${process.env.APP_VERSION || '1.0'}`)
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.enableCors({
    origin: '*', // Allows all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Optional: include if your requests require credentials
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
