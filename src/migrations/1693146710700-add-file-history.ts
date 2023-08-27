import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileHistory1693146710700 implements MigrationInterface {
    name = 'AddFileHistory1693146710700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originalName" character varying NOT NULL, "fileId" uuid NOT NULL, "versionNumber" integer NOT NULL DEFAULT '1', "key" character varying NOT NULL, "mimeType" character varying NOT NULL, "size" integer NOT NULL, "location" character varying NOT NULL, "safe" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_c82d8bd54658469ea276ca720cc" UNIQUE ("key"), CONSTRAINT "PK_0deb31e450cde5a323d8af4aa3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_history" ADD CONSTRAINT "FK_8a791caa16b755e8fd1e3af3605" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_history" DROP CONSTRAINT "FK_8a791caa16b755e8fd1e3af3605"`);
        await queryRunner.query(`DROP TABLE "file_history"`);
    }

}
