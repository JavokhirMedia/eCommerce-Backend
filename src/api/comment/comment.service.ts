import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/core/entity/comment.entity';
import { UserEntity } from 'src/core/entity/user.entity';
import { ProductEntity } from 'src/core/entity/product.entity';
import { responseByLang } from 'src/infrastructure/prompts/responsePrompts';
import { ResponseTypes } from 'src/common/database/Enums';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    
  ) { }

  async create(createCommentDto: CreateCommentDto, user: UserEntity, lang: string) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      created_by: user,
    });
    await this.commentRepository.save(comment);
    return { data: comment, status_code: 201, message: responseByLang(ResponseTypes.CREATE, lang) };
  }

  async findAll(productId: string, lang: string) {
    const comments = await this.commentRepository.find({ where: { product: { id: productId }, is_deleted: false } });
    return { data: comments, status_code: 200, message: responseByLang(ResponseTypes.FETCH_ALL, lang) };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, lang: string) {
    const comment = await this.commentRepository.findOne({ where: { id, is_deleted: false } });
    if (!comment) throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    Object.assign(comment, updateCommentDto);
    await this.commentRepository.save(comment);
    return { data: comment, status_code: 200, message: responseByLang(ResponseTypes.UPDATE, lang) };
  }

  async remove(id: string, lang: string) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException(responseByLang(ResponseTypes.NOT_FOUND, lang));
    comment.is_deleted = true;
    await this.commentRepository.save(comment);
    return { data: null, status_code: 200, message: responseByLang(ResponseTypes.DELETE, lang) };
  }
}
