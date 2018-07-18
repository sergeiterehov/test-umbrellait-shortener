import * as express from "express";
import * as path from "path";
import * as expressValidator from "express-validator";
import { json, urlencoded } from "body-parser";
import { LinkController } from "./controllers/LinkController";
import apiVersion1 from "./routers/api-v1";
import { config } from "./helpers/config";

export const app = express();

app.set("port", config.app.port);
app.set("views", path.join(__dirname, "../views").normalize());
app.set("view engine", "pug");

app.use(json());
app.use(urlencoded({
    extended: true,
}));
app.use(expressValidator());

// API

app.use("/api/v1", apiVersion1);

// Frontend

app.get("/", async (req, res) => {
    res.render("index.pug");
});

// Links

app.get("/:id", LinkController.getLink);
