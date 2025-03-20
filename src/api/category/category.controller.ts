import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Logger,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from "@nestjs/swagger";
import { CategoryEntity } from "src/core/entity/category.entity";
import { Roles } from "src/common/database/Enums";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../auth/users/AuthGuard";
import { RolesGuard } from "../auth/roles/RoleGuard";
import { RolesDecorator } from "../auth/roles/RolesDecorator";
import { CurrentUser } from "src/common/decorator/current-user";
import { CurrentLanguage } from "src/common/decorator/current-language";

@ApiTags("Categories")
@ApiBearerAuth("access-token")
@Controller("categories")
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) { }

  // Get all categories
  @ApiOperation({ summary: "Get all categories" })
  @ApiResponse({ status: 200, description: "List of all categories", type: [CategoryEntity] })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })

  @Get()
  async getAllCategories(@CurrentLanguage() lang: string) {
    this.logger.log("Fetching all categories");
    return this.categoryService.findAll(lang);
  }

  // Get category by ID
  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Category found", type: CategoryEntity })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiParam({ name: "id", type: "string", description: "Category ID" })
  @Get(":id")
  async getCategoryById(
    @Param("id") id: string,
    @CurrentLanguage() lang: string,
  ) {
    return await this.categoryService.findOne(id, lang);
  }

  // Create category
  @ApiOperation({ summary: "Create new category" })
  @ApiResponse({ status: 201, description: "Category created", type: CategoryEntity })
  @ApiResponse({ status: 409, description: "Category with this name already exists" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentLanguage() lang: string,
  ) {
    this.logger.log("Creating new category");
    return this.categoryService.create(createCategoryDto, lang);
  }

  // Update category
  @ApiOperation({ summary: "Update category" })
  @ApiResponse({ status: 200, description: "Category updated", type: CategoryEntity })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiParam({ name: "id", type: "string", description: "Category ID" })
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(":id")
  async updateCategory(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentLanguage() lang: string,
  ) {
    this.logger.log(`Updating category with ID: ${id}`);
    return this.categoryService.update(id, updateCategoryDto, lang);
  }

  // Delete category
  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  @ApiResponse({ status: 404, description: "Category not found" })
  @ApiQuery({ name: "lang", required: false, description: "Language (en, ru, uz)" })
  @ApiParam({ name: "id", type: "string", description: "Category ID" })
  @RolesDecorator(Roles.ADMIN, Roles.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(":id")
  async deleteCategory(
    @Param("id") id: string,
    @CurrentLanguage() lang: string,
  ) {
    this.logger.log(`Deleting category with ID: ${id}`);
    return this.categoryService.remove(id, lang);
  }
}
