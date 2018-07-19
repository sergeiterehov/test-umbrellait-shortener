import { validationResult } from "express-validator/check";
import { Request, Response, NextFunction } from "express";

/**
 * Send 403 HTTP code, when received errors from validation
 * @param req Request
 * @param res Response
 * @param next Next function
 */
export async function StopValidationError(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (! errors.isEmpty()) {
        return res.status(400).send({
            errors: errors.array(),
        });
    }

    next();
}
