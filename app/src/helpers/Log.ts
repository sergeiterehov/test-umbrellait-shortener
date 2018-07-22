import * as fs from "fs";

/**
 * Simple logging system (without locks)
 */
class Log {
    private name: string;
    private stream: fs.WriteStream;

    constructor(name: string, stream: fs.WriteStream) {
        this.name = name;
        this.stream = stream;
    }

    public info(data: any, category: string = "default"): this {
        this.log("INFO", category, JSON.stringify(data));

        return this;
    }

    private log(type: string, category: string, message: string) {
        const time = (new Date()).toISOString();

        this.stream.write(`${type} [${this.name}/${category}] (${time}): ${message}\n`);
    }
}

export const log = {
    /**
     * Application log
     */
    app: new Log("app", fs.createWriteStream(null, {
        fd: fs.openSync("/var/log/app.log", "ax"),
    })),
    /**
     * Links log
     */
    link: new Log("app", fs.createWriteStream(null, {
        fd: fs.openSync("/var/log/link.log", "ax"),
    })),
};
