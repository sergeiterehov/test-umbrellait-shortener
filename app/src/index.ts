import { createConnection, getRepository } from "typeorm";
import { app } from "./app";
import * as errorHandler from "errorhandler";

createConnection().then(async (connection) => {
    console.log("Connected!");

    // TODO: fix it
    console.warn("Connection settings are in the 'ormconfig.json' file!");
});

app.use(errorHandler());

export const server = app.listen(app.get("port"), () => {
    console.log("Server started!");
});
