import { createConnection, getRepository } from "typeorm";
import { Link } from "./entity/Link";
import { LinkHelper } from "./helpers/LinkHelper";

// TODO: connection settings are in the "ormconfig.json" file!!!
createConnection().then(async (connection) => {
    const repo = getRepository(Link);

    const link = await LinkHelper.createLink("http://localhost/");
    await LinkHelper.registerOpen(link);

    const list = await repo.find();

    console.log(list);

    LinkHelper.flushOpens();
});
