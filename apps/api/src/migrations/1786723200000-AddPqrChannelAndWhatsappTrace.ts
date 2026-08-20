import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPqrChannelAndWhatsappTrace1786723200000 implements MigrationInterface {
  name = 'AddPqrChannelAndWhatsappTrace1786723200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pqrs" ADD COLUMN "canal_origen" character varying(30) NOT NULL DEFAULT \'PORTAL_CLIENTE\''
    );
    await queryRunner.query('ALTER TABLE "pqrs" ADD COLUMN "whatsapp_abierto_at" TIMESTAMP WITH TIME ZONE');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "pqrs" DROP COLUMN "whatsapp_abierto_at"');
    await queryRunner.query('ALTER TABLE "pqrs" DROP COLUMN "canal_origen"');
  }
}
