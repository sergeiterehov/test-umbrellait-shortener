import * as express from "express";
import { ShortController } from "../controllers/api/ShortController";
import { body } from "express-validator/check";
import { StopValidationError } from "../middlewares/StopValidationError";

const protectedNames = [
    "api",
];

const api = express.Router();

api.post("/short/create", [
    body("url")
        .isURL().withMessage("Use valid URL address")
        .isLength({min: 7, max: 1024}).withMessage("Length is incorrect"),
    body("name")
        .optional().isString().withMessage("Name must be a string")
        .isLength({
            min: 3,
            max: 32,
        }).withMessage("Use 3-32 chars long")
        .custom(async (value) => {
            if (/[^a-zA-Z0-9_\-]/.test(value)) {
                throw new Error("Used forbidden char");
            }

            if (-1 !== protectedNames.indexOf(value)) {
                throw new Error("Used protected name");
            }
        }),
], StopValidationError, ShortController.postCreate);

export default api;
