import { Request, Response } from "express";
import { LinkHelper } from "../../helpers/LinkHelper";
import { Link } from "../../entity/Link";

/**
 * Api Link controller
 */
export class ShortController {
    /**
     * Create new short link
     * @param req Request
     * @param res Response
     */
    public static async postCreate(req: Request, res: Response) {
        const url = req.body.url;
        const name = req.body.name;

        let link: Link;

        try {
            link = await LinkHelper.createLink(url, name);
        } catch (e) {
            return res.status(500).send("Link can not be created");
        }

        return res.send({
            short: link.id,
            source: url,
        });
    }

    /**
     * Returns most popular links
     * @param req Request
     * @param res Response
     */
    public static async getTop(req: Request, res: Response) {
        const links = await LinkHelper.getMostPopular(10);
        const data = links.map((link) => ({
            link: link.id,
            views: link.amountOpen,
        }));

        return res.send(data);
    }
}
