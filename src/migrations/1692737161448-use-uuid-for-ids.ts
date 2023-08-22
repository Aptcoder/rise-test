import { MigrationInterface, QueryRunner } from "typeorm";

export class UseUuidForIds1692737161448 implements MigrationInterface {
    name = 'UseUuidForIds1692737161448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_22a7efc685759536e250b956be9"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "PK_6278a41a706740c94c02e288df8"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "folder" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_22a7efc685759536e250b956be9" PRIMARY KEY ("fileId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4311d14b53fcbc5744d9eefaa"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP COLUMN "folderId"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD "folderId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_22a7efc685759536e250b956be9"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee" PRIMARY KEY ("fileId", "folderId")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_f4311d14b53fcbc5744d9eefaa9" PRIMARY KEY ("folderId")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22a7efc685759536e250b956be"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP COLUMN "fileId"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD "fileId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_f4311d14b53fcbc5744d9eefaa9"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee" PRIMARY KEY ("folderId", "fileId")`);
        await queryRunner.query(`CREATE INDEX "IDX_f4311d14b53fcbc5744d9eefaa" ON "folder_files_file" ("folderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_22a7efc685759536e250b956be" ON "folder_files_file" ("fileId") `);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_22a7efc685759536e250b956be9" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_22a7efc685759536e250b956be9"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22a7efc685759536e250b956be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4311d14b53fcbc5744d9eefaa"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_f4311d14b53fcbc5744d9eefaa9" PRIMARY KEY ("folderId")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP COLUMN "fileId"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD "fileId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_22a7efc685759536e250b956be" ON "folder_files_file" ("fileId") `);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_f4311d14b53fcbc5744d9eefaa9"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee" PRIMARY KEY ("fileId", "folderId")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_22a7efc685759536e250b956be9" PRIMARY KEY ("fileId")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP COLUMN "folderId"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD "folderId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_f4311d14b53fcbc5744d9eefaa" ON "folder_files_file" ("folderId") `);
        await queryRunner.query(`ALTER TABLE "folder_files_file" DROP CONSTRAINT "PK_22a7efc685759536e250b956be9"`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee" PRIMARY KEY ("folderId", "fileId")`);
        await queryRunner.query(`ALTER TABLE "folder" DROP CONSTRAINT "PK_6278a41a706740c94c02e288df8"`);
        await queryRunner.query(`ALTER TABLE "folder" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "folder" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "folder" ADD CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "file" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_22a7efc685759536e250b956be9" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
