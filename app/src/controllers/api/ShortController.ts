import { Request, Response } from "express";
import { LinkHelper } from "../../helpers/LinkHelper";
import { Link } from "../../entity/Link";

export class ShortController {
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
}
