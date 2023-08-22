import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUniqueFields1692732175361 implements MigrationInterface {
    name = 'MakeUniqueFields1692732175361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_e4a453ce0a609a5f94c66afb6ca" UNIQUE ("key")`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "UQ_6c1d94a58a2bd91753e7be9d9df" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "UQ_6c1d94a58a2bd91753e7be9d9df"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_e4a453ce0a609a5f94c66afb6ca"`);
    }

}
