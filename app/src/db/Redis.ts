import * as Redis from "ioredis";
import { config } from "../helpers/config";

const params = config.redis;

export const redis = new Redis(params.port, params.host);
