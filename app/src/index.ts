import { createConnection, getRepository } from "typeorm";
import { app } from "./app";
import * as errorHandler from "errorhandler";
import { local } from "./local";

createConnection().then(async (connection) => {
    console.log("Connected!");

    // TODO: fix it
    console.warn("Connection settings are in the 'ormconfig.json' file!");
});

if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

export const server = app.listen(app.get("port"), () => {
    console.log("Server started!");
});

local.use(errorHandler());

export const localServer = local.listen(1337, () => {
    console.log("Local server started!");
});
