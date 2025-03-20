// src/common/guard/RoleGuard.ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "src/common/database/Enums";
import { ROLES_KEY } from "./RolesDecorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Handler va class orqali kerakli rollarni olish
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Agar rol kerak bo'lmasa, ruxsat berish
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        // Foydalanuvchi borligini tekshirish
        const user = request.user;
        if (!user) {
            return false;
        }

        // Foydalanuvchi rolini string tipida olish
        const userRole = user.role?.toString();

        // Rollarni string sifatida solishtirib ko'rish
        for (const role of requiredRoles) {
            if (role.toString() === userRole) {
                return true;
            }
        }
        return false;
    }
}