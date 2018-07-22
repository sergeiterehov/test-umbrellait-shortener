import * as express from "express";
import { LinkHelper } from "./helpers/LinkHelper";
import { config } from "./helpers/config";

/**
 * Inside services application
 */
export const local = express();

/**
 * Moving counters from cache to database
 */
local.get("/cache/flush-counters", async (req, res) => {
    await LinkHelper.flushOpens();
    res.send("ok");
});

/**
 * Deleting old links
 */
local.get("/links/delete-old", async (req, res) => {
    await LinkHelper.cleanByTTL(config.links.ttl);
    res.send("ok");
});
