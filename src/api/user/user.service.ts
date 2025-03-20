import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/core/entity/user.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { responseByLang } from "src/infrastructure/prompts/responsePrompts";
import { ResponseTypes } from "src/common/database/Enums";
import { FileService } from "src/infrastructure/file/file.service";
import { UpdateUserDto } from "./dto/update-user.dto";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
  ) { }

  // **1️⃣ Get all users**
  async getAllUsers(lang: string) {
    const users = await this.userRepository.find({
      where: { is_deleted: false },
      relations: ['created_by', 'updated_by']
    });

    return {
      data: users,
      status_code: 200,
      message: responseByLang(ResponseTypes.FETCH_ALL, lang)
    };
  }

  // **2️⃣ Get all deleted users**
  async getAllDeletedUsers(lang: string) {
    const deletedUsers = await this.userRepository.find({
      where: { is_deleted: true },
      relations: ['created_by', 'updated_by']
    });

    return {
      data: deletedUsers,
      status_code: 200,
      message: responseByLang(ResponseTypes.FETCH_DELETED, lang)
    };
  }

  // **3️⃣ Get user by ID**
  async getUserById(id: string, lang: string) {
    const user = await this.userRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['created_by', 'updated_by']
    });

    if (!user) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    return {
      data: user,
      status_code: 200,
      message: responseByLang(ResponseTypes.FETCH_ONE, lang)
    };
  }

  // **4️⃣ Create user**
  async createUser(createUserDto: CreateUserDto, createdBy: UserEntity, lang: string, file: Express.Multer.File) {

    const imagePath = await this.fileService.saveFile(file)

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email, is_deleted: false }
    });

    if (existingUser) {
      throw new ConflictException(responseByLang(ResponseTypes.ALREADY_EXISTS, lang));
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      avatar: imagePath,
      created_by: createdBy,
      updated_by: createdBy,
      created_at: Date.now(),
    });

    await this.userRepository.save(newUser);

    return {
      data: newUser,
      status_code: 201,
      message: responseByLang(ResponseTypes.CREATE, lang)
    };
  }

  // **5️⃣ Update user**
  async updateUser(
    id: string,
    updateData: UpdateUserDto,
    updatedBy: UserEntity,
    lang: string,
    file?: Express.Multer.File
  ) {
    const user = await this.userRepository.findOne({ where: { id, is_deleted: false } });

    if (!user) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    if (Object.keys(updateData).length === 0) {
      throw new ConflictException(responseByLang(ResponseTypes.NO_DATA, lang));
    }

    // **Agar rasm yuklangan bo‘lsa, eski rasmni o‘chirish va yangi rasmni saqlash**
    if (file) {
      if (user.avatar) {
        await this.fileService.deleteFile(user.avatar);
      }
      updateData.avatar = await this.fileService.saveFile(file);
    }

    // **Agar parol yangilanayotgan bo‘lsa, uni hash qilish**
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);
    user.updated_by = updatedBy;
    user.updated_at = Date.now();

    await this.userRepository.save(user);

    return {
      data: user,
      status_code: 200,
      message: responseByLang(ResponseTypes.UPDATE, lang)
    };
  }

  // **6️⃣ Soft delete user**
  async softDeleteUser(id: string, deletedBy: UserEntity, lang: string) {
    const user = await this.userRepository.findOne({ where: { id, is_deleted: false } });

    if (!user) {
      throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    }

    user.is_deleted = true;
    user.deleted_by = deletedBy;
    user.deleted_at = Date.now();

    await this.userRepository.save(user);

    return {
      data: null,
      status_code: 200,
      message: responseByLang(ResponseTypes.DELETE, lang)
    };
  }
}
