import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowAnonymousPqr1786636800000 implements MigrationInterface {
  name = 'AllowAnonymousPqr1786636800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "pqrs" ALTER COLUMN "cliente_id" DROP NOT NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "pqrs" ALTER COLUMN "cliente_id" SET NOT NULL');
  }
}
