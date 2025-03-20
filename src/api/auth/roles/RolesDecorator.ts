import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/database/Enums';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: Roles[]) => {
    return SetMetadata(ROLES_KEY, roles);
};