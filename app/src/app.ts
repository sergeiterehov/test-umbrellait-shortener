import * as express from "express";
import * as path from "path";
import * as expressValidator from "express-validator";
import { json, urlencoded } from "body-parser";
import { LinkController } from "./controllers/LinkController";
import apiVersion1 from "./routers/api-v1";

export const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path);

app.use(json());
app.use(urlencoded({
    extended: true,
}));
app.use(expressValidator());

// API

app.use("/api/v1", apiVersion1);

// Frontend

app.get("/", async (req, res) => {
    res.send("Hello, world!");
});

// Links

app.get("/:id", LinkController.getLink);
