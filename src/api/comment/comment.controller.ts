import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/common/decorator/current-user';
import { UserEntity } from 'src/core/entity/user.entity';
import { CurrentLanguage } from 'src/common/decorator/current-language';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/users/AuthGuard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth('access-token')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully created' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: UserEntity,
    @CurrentLanguage() lang: string
  ) {
    return this.commentService.create(createCommentDto, currentUser, lang);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get comments for a product' })
  @ApiResponse({ status: 200, description: 'List of comments' })
  findAll(@Param('productId') productId: string, @CurrentLanguage() lang: string) {
    return this.commentService.findAll(productId, lang);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully updated' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentLanguage() lang: string
  ) {
    return this.commentService.update(id, updateCommentDto, lang);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted' })
  remove(@Param('id') id: string, @CurrentLanguage() lang: string) {
    return this.commentService.remove(id, lang);
  }
}