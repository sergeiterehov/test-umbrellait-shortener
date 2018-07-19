import { Request, Response } from "express";
import { LinkHelper } from "../helpers/LinkHelper";

/**
 * Site link controller
 */
export class LinkController {
    /**
     * Search short link
     * @param req Request
     * @param res Response
     */
    public static async getLink(req: Request, res: Response) {
        const id = req.params.id;

        let url: string|void;

        try {
            url = await LinkHelper.open(id);
        } catch (e) {
            return res.send((e as Error).message);
        }

        if (! url) {
            return res.status(404).send("Not found!");
        }

        return res.redirect(url);
    }
}
