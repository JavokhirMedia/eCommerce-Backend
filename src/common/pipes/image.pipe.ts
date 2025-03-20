import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname, basename } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
    private readonly allowedExtensions = ['.jpeg', '.jpg', '.png', '.svg', '.heic'];
    private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/heic'];
    private readonly maxSize = 5 * 1024 * 1024; // 5MB

    transform(value: any) {
        if (!value || !value.originalname || !value.mimetype || !value.size) {
            return value;
        }

        // Fayl kengaytmasini tekshirish
        const fileExtension = extname(value.originalname).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
            throw new BadRequestException(`Only image files (JPEG, JPG, PNG, SVG, HEIC) are allowed.`);
        }

        // MIME turini tekshirish
        if (!this.allowedMimeTypes.includes(value.mimetype)) {
            throw new BadRequestException(`Invalid file type. Please upload a valid image.`);
        }

        // Fayl hajmini tekshirish
        if (value.size > this.maxSize) {
            throw new BadRequestException(`File size should not exceed 5MB.`);
        }

        return value;
    }
}
