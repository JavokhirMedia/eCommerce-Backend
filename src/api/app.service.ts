import { HttpStatus, Injectable, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from "express";
import { AppModule } from './app.module';
import { config } from 'src/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from 'src/infrastructure/filter/all-exception.filter';

@Injectable()
export class Application {
  public static async main(): Promise<void> {
    let app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: "*",
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    app.setGlobalPrefix("api");
    app.use("/images", express.static(join(process.cwd(), "uploads")));


    const swagger = new DocumentBuilder()
      .setTitle('API nomi')
      .setDescription('API tavsifi')
      .setVersion('1.0')
      .addBearerAuth(  // Bearer Token sozlamalari
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token', // Token nomi
      )
      .build();

    const document = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('api', app, document);

    // app.useGlobalFilters(new AllExceptionFilter());

    await app.listen(config.PORT, () => {
      console.log(`Server running on  ${config.PORT} port`);
    });
  }
}
