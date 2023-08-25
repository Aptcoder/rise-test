import { MigrationInterface, QueryRunner } from "typeorm";

export class ReviewerTable1692961390978 implements MigrationInterface {
    name = 'ReviewerTable1692961390978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comment" character varying, "safe" boolean NOT NULL DEFAULT false, "reviewerId" uuid NOT NULL, "fileId" uuid NOT NULL, "deletedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2d56319d0a65ecca519c5e6172" ON "review" ("fileId", "reviewerId") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_34413365b39e3bf5bea866569b4" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_04bb5571d7f936882a0d263ae33" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_04bb5571d7f936882a0d263ae33"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_34413365b39e3bf5bea866569b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2d56319d0a65ecca519c5e6172"`);
        await queryRunner.query(`DROP TABLE "review"`);
    }

}
