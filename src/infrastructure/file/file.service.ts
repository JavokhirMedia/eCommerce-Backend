import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { join, extname } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileService {
  private readonly uploadsFolder = join(process.cwd(), 'uploads');

  constructor() {
    fs.mkdir(this.uploadsFolder, { recursive: true }).catch(() => null);
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      await fs.mkdir(this.uploadsFolder, { recursive: true });

      const fileName = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
      const filePath = join(this.uploadsFolder, fileName);

      await fs.writeFile(filePath, file.buffer);

      return `${fileName}`;
    } catch (error) {
      throw new BadRequestException(`Error saving file: ${error.message}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = join(this.uploadsFolder, fileName);

      if (!(await this.fileExists(filePath))) {
        throw new BadRequestException('File not found');
      }

      await fs.unlink(filePath);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error deleting file');
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
