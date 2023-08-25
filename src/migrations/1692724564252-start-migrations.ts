import { MigrationInterface, QueryRunner } from "typeorm"

export class StartMigrations1692724564252 implements MigrationInterface {
    name = "StartMigrations1692724564252"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM (
            'guest', 'admin')`)
        await queryRunner.query(
            `CREATE TABLE "file" ("id" SERIAL NOT NULL, "originalName" character varying NOT NULL, "key" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" integer NOT NULL, "location" character varying NOT NULL, "deletedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'guest', "dateJoined" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "folder" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "deletedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6278a41a706740c94c02e288df8" PRIMARY KEY ("id"))`
        )
        await queryRunner.query(
            `CREATE TABLE "folder_files_file" ("folderId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_69b5967ee73acd51dbc8891f1ee" PRIMARY KEY ("folderId", "fileId"))`
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_f4311d14b53fcbc5744d9eefaa" ON "folder_files_file" ("folderId") `
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_22a7efc685759536e250b956be" ON "folder_files_file" ("fileId") `
        )
        await queryRunner.query(
            `ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        )
        await queryRunner.query(
            `ALTER TABLE "folder_files_file" ADD CONSTRAINT "FK_22a7efc685759536e250b956be9" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_22a7efc685759536e250b956be9"`
        )
        await queryRunner.query(
            `ALTER TABLE "folder_files_file" DROP CONSTRAINT "FK_f4311d14b53fcbc5744d9eefaa9"`
        )
        await queryRunner.query(
            `DROP INDEX "public"."IDX_22a7efc685759536e250b956be"`
        )
        await queryRunner.query(
            `DROP INDEX "public"."IDX_f4311d14b53fcbc5744d9eefaa"`
        )
        await queryRunner.query(`DROP TABLE "folder_files_file"`)
        await queryRunner.query(`DROP TABLE "folder"`)
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(`DROP TABLE "file"`)
    }
}
