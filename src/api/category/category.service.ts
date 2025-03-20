import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/core/entity/category.entity';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { UpdateCategoryDto } from '../category/dto/update-category.dto';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';
import { ResponseTypes } from 'src/common/database/Enums';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  // **1️⃣ Create Category**
  async create(createCategoryDto: CreateCategoryDto, lang: string) {
    const { name, parentId } = createCategoryDto;
    const category = new CategoryEntity();
    category.name = name;

    if (parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: parentId } });
      if (!parent) throw new NotFoundException(responseByLang(ResponseTypes.PARENT_NOT_FOUND, lang));
      category.parent = parent;
    }

    await this.categoryRepository.save(category);
    return { data: category, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }

  // **2️⃣ Get All Categories**
  async findAll(lang: string) {
    const categories = await this.categoryRepository.find({ relations: ['parent', 'children'] });
    return { data: categories, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  // **3️⃣ Get Category by ID**
  async findOne(id: string, lang: string) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['parent', 'children'] });
    if (!category) throw new NotFoundException(responseByLang(ResponseTypes.CATEGORY_NOT_FOUND, lang));

    return { data: category, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ONE, lang) };
  }

  // **4️⃣ Update Category**
  async update(id: string, updateCategoryDto: UpdateCategoryDto, lang: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(responseByLang(ResponseTypes.CATEGORY_NOT_FOUND, lang));
    }

    if (updateCategoryDto.name) category.name = updateCategoryDto.name;

    if (updateCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentId } });
      if (!parent) throw new NotFoundException(responseByLang(ResponseTypes.PARENT_NOT_FOUND, lang));
      category.parent = parent;
    }

    await this.categoryRepository.save(category);
    return { data: category, status_code: 200, message: responseByLang(ResponseTypes.UPDATE, lang) };
  }

  // **5️⃣ Delete Category**
  async remove(id: string, lang: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(responseByLang(ResponseTypes.CATEGORY_NOT_FOUND, lang));
    }

    await this.categoryRepository.remove(category);
    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }
}
