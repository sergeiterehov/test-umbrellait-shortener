import { ConnectionOptions } from "typeorm";
import { config } from "../helpers/config";

const options: ConnectionOptions = {
    name: "default",
    type: "mysql",
    host: config.mysql.host,
    port: config.mysql.port,
    username: config.mysql.username,
    password: config.mysql.password,
    database: config.mysql.database,
    synchronize: false,
    logging: true,
    entities: [
        "dist/entity/*.js",
    ],
    subscribers: [
        "dist/subscriber/*.js",
    ],
    migrations: [
        "dist/migration/*.js",
    ],
    cli: {
        entitiesDir: "dist/entity",
        migrationsDir: "dist/migration",
        subscribersDir: "dist/subscriber",
    },
};

export default options;
