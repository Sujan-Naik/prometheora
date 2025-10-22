import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId?: string,
    @Body('projectId') projectId?: string,
    @Body('postId') postId?: string,
    @Body('caption') caption?: string,
    @Body('order') order?: string,
  ) {

console.log('Received file:', file);
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const url = await this.mediaService.uploadToS3(file);
    const type = this.mediaService.getMediaType(file.mimetype);

    const media = await this.mediaService.createMedia({
      url,
      type,
      caption,
      order: order ? parseInt(order) : undefined,
      userId: userId ? parseInt(userId) : undefined,
      projectId: projectId ? parseInt(projectId) : undefined,
      postId: postId ? parseInt(postId) : undefined,
    });

    return media;
  }

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('postId') postId?: string,
  ) {
    return this.mediaService.findAll({
      userId: userId ? parseInt(userId) : undefined,
      projectId: projectId ? parseInt(projectId) : undefined,
      postId: postId ? parseInt(postId) : undefined,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: { caption?: string; order?: number },
  ) {
    return this.mediaService.updateMedia(id, updateData);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.mediaService.deleteMedia(id);
  }
}