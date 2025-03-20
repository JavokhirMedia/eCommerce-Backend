import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core/entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FileService } from 'src/infrastructure/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, FileService],
  controllers: [UserController],
})
export class UserModule { }
