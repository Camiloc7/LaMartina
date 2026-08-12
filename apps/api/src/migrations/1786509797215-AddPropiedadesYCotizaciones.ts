import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropiedadesYCotizaciones1786509797215 implements MigrationInterface {
    name = 'AddPropiedadesYCotizaciones1786509797215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."propiedades_complejidad_enum" AS ENUM('BAJA', 'MEDIA', 'ALTA')`);
        await queryRunner.query(`CREATE TABLE "propiedades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "numero" character varying(100) NOT NULL, "extension" numeric(10,2) NOT NULL DEFAULT '0', "complejidad" "public"."propiedades_complejidad_enum" NOT NULL DEFAULT 'MEDIA', "conjunto_id" uuid NOT NULL, "propietario_id" uuid, "identificadorUnicoQr" character varying(100) NOT NULL, "pinAcceso" character varying(4) NOT NULL, "activo" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76615f844b6ebff2175136a7e7f" UNIQUE ("identificadorUnicoQr"), CONSTRAINT "PK_ee3a1dc8c0d17c197d54bc2ff37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cotizaciones_estado_enum" AS ENUM('BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA')`);
        await queryRunner.query(`CREATE TABLE "cotizaciones" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "conjunto_id" uuid NOT NULL, "propiedad_id" uuid, "detalles" json NOT NULL, "precioTotal" numeric(12,2) NOT NULL, "estado" "public"."cotizaciones_estado_enum" NOT NULL DEFAULT 'BORRADOR', "notasFinancieras" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4fcc685d6bca9b3a997ba9cd3bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."programaciones_servicio_estado_enum" AS ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TABLE "programaciones_servicio" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fechaProgramada" TIMESTAMP WITH TIME ZONE NOT NULL, "estado" "public"."programaciones_servicio_estado_enum" NOT NULL DEFAULT 'PENDIENTE', "conjunto_id" uuid NOT NULL, "propiedad_id" uuid, "cotizacion_id" uuid NOT NULL, "precioAcordado" numeric(12,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_00409c446722632dbb6c5aa8ab7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ordenes_trabajo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "programacion_id" uuid NOT NULL, "operario_id" uuid NOT NULL, "fechaInicio" TIMESTAMP WITH TIME ZONE, "fechaFin" TIMESTAMP WITH TIME ZONE, "observaciones" text, "evidenciaFotos" text, "reportePdfUrl" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_cd9cec565ce52da58a10e9fefd" UNIQUE ("programacion_id"), CONSTRAINT "PK_5f8d68249311211057d4ab1fbbb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pqrs" ADD "propiedad_id" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."pqrs_tipo_enum" RENAME TO "pqrs_tipo_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."pqrs_tipo_enum" AS ENUM('PETICION', 'QUEJA', 'RECLAMO', 'FELICITACION')`);
        await queryRunner.query(`ALTER TABLE "pqrs" ALTER COLUMN "tipo" TYPE "public"."pqrs_tipo_enum" USING "tipo"::"text"::"public"."pqrs_tipo_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pqrs_tipo_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."users_rol_enum" RENAME TO "users_rol_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_rol_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'CLIENTE', 'PROPIETARIO')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" TYPE "public"."users_rol_enum" USING "rol"::"text"::"public"."users_rol_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" SET DEFAULT 'CLIENTE'`);
        await queryRunner.query(`DROP TYPE "public"."users_rol_enum_old"`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_6df1ff0f78a98bbae3c0ec41ec2" FOREIGN KEY ("conjunto_id") REFERENCES "conjuntos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "propiedades" ADD CONSTRAINT "FK_1a61e31e26f53054b682fe0a976" FOREIGN KEY ("propietario_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pqrs" ADD CONSTRAINT "FK_10c1cf4dfbb187ee4e71564b4e8" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" ADD CONSTRAINT "FK_9f0f4a0cab790611bb8a23bccb8" FOREIGN KEY ("conjunto_id") REFERENCES "conjuntos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" ADD CONSTRAINT "FK_3bbd777c2e1677700816c89c0ec" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" ADD CONSTRAINT "FK_f2fc0e201b4caf9215351b302ad" FOREIGN KEY ("conjunto_id") REFERENCES "conjuntos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" ADD CONSTRAINT "FK_f9a8e10666c6788f1c2ca27a78c" FOREIGN KEY ("propiedad_id") REFERENCES "propiedades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" ADD CONSTRAINT "FK_e472e4e93de2d5c16b66ae36064" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "FK_cd9cec565ce52da58a10e9fefdb" FOREIGN KEY ("programacion_id") REFERENCES "programaciones_servicio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "FK_f6c2ce1d8eaeee5073bb51688da" FOREIGN KEY ("operario_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ordenes_trabajo" DROP CONSTRAINT "FK_f6c2ce1d8eaeee5073bb51688da"`);
        await queryRunner.query(`ALTER TABLE "ordenes_trabajo" DROP CONSTRAINT "FK_cd9cec565ce52da58a10e9fefdb"`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" DROP CONSTRAINT "FK_e472e4e93de2d5c16b66ae36064"`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" DROP CONSTRAINT "FK_f9a8e10666c6788f1c2ca27a78c"`);
        await queryRunner.query(`ALTER TABLE "programaciones_servicio" DROP CONSTRAINT "FK_f2fc0e201b4caf9215351b302ad"`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" DROP CONSTRAINT "FK_3bbd777c2e1677700816c89c0ec"`);
        await queryRunner.query(`ALTER TABLE "cotizaciones" DROP CONSTRAINT "FK_9f0f4a0cab790611bb8a23bccb8"`);
        await queryRunner.query(`ALTER TABLE "pqrs" DROP CONSTRAINT "FK_10c1cf4dfbb187ee4e71564b4e8"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_1a61e31e26f53054b682fe0a976"`);
        await queryRunner.query(`ALTER TABLE "propiedades" DROP CONSTRAINT "FK_6df1ff0f78a98bbae3c0ec41ec2"`);
        await queryRunner.query(`CREATE TYPE "public"."users_rol_enum_old" AS ENUM('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'CLIENTE')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" TYPE "public"."users_rol_enum_old" USING "rol"::"text"::"public"."users_rol_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "rol" SET DEFAULT 'CLIENTE'`);
        await queryRunner.query(`DROP TYPE "public"."users_rol_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_rol_enum_old" RENAME TO "users_rol_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."pqrs_tipo_enum_old" AS ENUM('PETICION', 'QUEJA', 'RECLAMO')`);
        await queryRunner.query(`ALTER TABLE "pqrs" ALTER COLUMN "tipo" TYPE "public"."pqrs_tipo_enum_old" USING "tipo"::"text"::"public"."pqrs_tipo_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."pqrs_tipo_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."pqrs_tipo_enum_old" RENAME TO "pqrs_tipo_enum"`);
        await queryRunner.query(`ALTER TABLE "pqrs" DROP COLUMN "propiedad_id"`);
        await queryRunner.query(`DROP TABLE "ordenes_trabajo"`);
        await queryRunner.query(`DROP TABLE "programaciones_servicio"`);
        await queryRunner.query(`DROP TYPE "public"."programaciones_servicio_estado_enum"`);
        await queryRunner.query(`DROP TABLE "cotizaciones"`);
        await queryRunner.query(`DROP TYPE "public"."cotizaciones_estado_enum"`);
        await queryRunner.query(`DROP TABLE "propiedades"`);
        await queryRunner.query(`DROP TYPE "public"."propiedades_complejidad_enum"`);
    }

}
