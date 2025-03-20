import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { config } from 'src/config';
import { RedisCacheService } from './redis.service';

@Module({
    imports: [
        ConfigModule,
        NestRedisModule.forRoot({
            type: 'single',
            url: config.REDIS_URL
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisModule { }
