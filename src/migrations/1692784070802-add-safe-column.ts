import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSafeColumn1692784070802 implements MigrationInterface {
    name = 'AddSafeColumn1692784070802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "safe" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "safe"`);
    }

}
