import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { ValidationError } from 'class-validator';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const requestTime = new Date().toISOString();

        // Validation Errorlar
        if (exception instanceof BadRequestException) {
            const responseObject = exception.getResponse() as any;
            const message =
                responseObject.message ||
                'Validation failed: one or more fields are invalid';
            const validationErrors =
                responseObject.message instanceof Array
                    ? responseObject.message
                    : [responseObject.message];

            return response.status(400).json({
                statusCode: 400,
                message,
                validationErrors,
                errorName: 'BadRequestException',
                requestTime,
                url: request.url,
            });
        }

        if (
            exception instanceof ValidationError ||
            (exception.response && exception.response.statusCode === 400)
        ) {
            return response.status(400).json({
                statusCode: 400,
                message: 'Validation error',
                errorName: 'ValidationError',
                details: exception.response?.message || exception.message,
                requestTime,
                url: request.url,
            });
        }

        // Database Connection Errors
        if (exception instanceof QueryFailedError) {
            return response.status(500).json({
                statusCode: 500,
                message: 'Database connection error',
                errorName: 'QueryFailedError',
                detail: (exception as any).detail,
                requestTime,
                url: request.url,
            });
        }

        if (exception instanceof TypeORMError) {
            return response.status(500).json({
                statusCode: 500,
                message: 'Database error',
                errorName: 'TypeORMError',
                requestTime,
                url: request.url,
            });
        }

        // Rate Limit va Authorization Errorlar
        if (exception instanceof UnauthorizedException) {
            return response.status(401).json({
                statusCode: 401,
                message: 'Unauthorized',
                errorName: 'UnauthorizedException',
                requestTime,
                url: request.url,
            });
        }

        if (exception instanceof ForbiddenException) {
            return response.status(403).json({
                statusCode: 403,
                message: 'Forbidden',
                errorName: 'ForbiddenException',
                requestTime,
                url: request.url,
            });
        }

        // Too Many Requests (429)
        if (exception instanceof HttpException && exception.getStatus() === 429) {
            return response.status(429).json({
                statusCode: 429,
                message: 'Too many requests',
                errorName: 'TooManyRequestsException',
                requestTime,
                url: request.url,
            });
        }

        // HttpException Errorlar
        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json({
                statusCode: exception.getStatus(),
                message: exception.message,
                errorName: exception.name,
                requestTime,
                url: request.url,
            });
        }

        // Boshqa noma'lum xatoliklar
        return response.status(500).json({
            statusCode: 500,
            message: exception?.message || 'Internal server error',
            errorName: exception?.name || 'UnknownError',
            requestTime,
            url: request.url,
        });
    }
}
