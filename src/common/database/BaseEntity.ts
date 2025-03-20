import { UserEntity } from "src/core/entity/user.entity";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        name: "is_active",
        type: "boolean",
        default: true,
    })
    is_active!: boolean;

    @Column({
        name: "is_deleted",
        type: "boolean",
        default: false,
    })
    is_deleted!: boolean;

    @Column({
        name: "created_at",
        type: "bigint",
        default: () => "EXTRACT(epoch FROM NOW()) * 1000",
    })
    created_at!: number;

    @Column({
        name: "updated_at",
        type: "bigint",
        default: Date.now(),
    })
    updated_at!: number;

    @Column({ name: "deleted_at", type: "bigint", nullable: true })
    deleted_at!: number;

    @ManyToOne(() => UserEntity, (user) => user.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "created_by" })
    created_by!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "updated_by" })
    updated_by!: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "deleted_by" })
    deleted_by!: UserEntity;
}
