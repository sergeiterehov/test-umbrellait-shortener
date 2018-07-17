import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class Init1531821747203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "link",
            columns: [
                {
                    isPrimary: true,
                    name: "id",
                    type: "varchar(32)",
                },
                {
                    name: "createdAt",
                    type: "datetime",
                },
                {
                    name: "sourceLink",
                    type: "varchar(1024)",
                },
                {
                    name: "amountOpen",
                    type: "int",
                },
            ],
        }), true);

        await queryRunner.createIndex("link", new TableIndex({
            name: "idx_link_created_at",
            columnNames: ["createdAt"],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("link");
    }

}
