import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
  NotFoundException,
  UseGuards,
  Post,
  Query,
  UseInterceptors,
  UploadedFile
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { UserEntity } from "src/core/entity/user.entity";
import { UserService } from "./user.service";
import { Roles } from "src/common/database/Enums";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { JwtAuthGuard } from "../auth/users/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { CreateUserDto } from "./dto/create-user.dto";
import { CurrentUser } from "src/common/decorator/current-user";
import { Public } from "src/common/decorator/public.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CurrentLanguage } from "src/common/decorator/current-language";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Users")
@ApiBearerAuth('access-token')
@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: "Get all users" })
  @ApiResponse({ status: 200, description: "List of all users", type: [UserEntity] })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Get()
  async getAllUsers(
    @CurrentUser() user: UserEntity,
    @CurrentLanguage() lang: string,
  ) {
    this.userService.getAllUsers(lang);
  }

  @ApiOperation({ summary: "Get all deleted users" })
  @ApiResponse({ status: 200, description: "List of all deleted users", type: [UserEntity] })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Get('deleted')
  async getAllDeletedUsers(@Query('lang') lang: string) {
    return this.userService.getAllDeletedUsers(lang);
  }

  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found", type: UserEntity })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Get(":id")
  async getUserById(
    @Param("id") id: string,
    @CurrentLanguage() lang: string
  ) {
    return await this.userService.getUserById(id, lang);
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User creation payload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'newemail@example.com' },
        password: { type: 'string', example: 'NewPassword123!' },
        role: { type: 'string', example: 'user' },
        avatar: { type: 'string', format: 'binary' },
      },
      required: [],
    },
  })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() createdBy: UserEntity,
    @CurrentLanguage() lang: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.userService.createUser(createUserDto, createdBy, lang, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'No data provided for update' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User update payload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'newemail@example.com' },
        password: { type: 'string', example: 'NewPassword123!' },
        role: { type: 'string', example: 'user' },
        avatar: { type: 'string', format: 'binary' },
      },
      required: [],
    },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() updatedBy: UserEntity,
    @CurrentLanguage() lang: string,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.userService.updateUser(id, updateUserDto, updatedBy, lang, file);
  }


  @ApiOperation({ summary: "Soft delete user" })
  @ApiResponse({ status: 200, description: "User soft deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Delete(":id")
  async deleteUser(
    @Param("id") id: string,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.userService.softDeleteUser(id, currentUser, lang);
  }


  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User profile found", type: UserEntity })
  @ApiResponse({ status: 404, description: "User profile not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Get("me")
  async getUserProfile(
    @CurrentUser() user: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.userService.getUserById(user.id, lang);
  }


  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'No data provided for update' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'User update payload',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'newemail@example.com' },
        password: { type: 'string', example: 'NewPassword123!' },
        role: { type: 'string', example: 'user' },
        avatar: { type: 'string', format: 'binary' },
      },
      required: [],
    },
  })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() updatedBy: UserEntity,
    @CurrentLanguage() lang: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.updateUser(id, updateUserDto, updatedBy, lang, file);
  }

  @ApiOperation({ summary: "Soft delete profile" })
  @ApiResponse({ status: 200, description: "User soft deleted" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.SUPER_ADMIN)
  @Delete("me")
  async deleteProfile(
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.userService.softDeleteUser(currentUser.id, currentUser, lang);
  }

}
