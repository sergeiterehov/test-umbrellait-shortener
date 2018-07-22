import * as http from "http";
import * as https from "https";

/**
 * Helper for HTTP protocol actions
 */
export class HttpHelper {
    /**
     * Checks then link is available (HTTP 100s or 200s)
     * @param url Url
     */
    public static async checkAvailable(url: string): Promise<boolean> {
        const protocol: string = /^(?<type>http(s)?):\/\//.exec(url).groups.type;

        if (! protocol) {
            return false;
        }

        switch (protocol.toLowerCase()) {
            default:
                return false;

            case "http":
                return new Promise<boolean>((done, cancel) => {
                    http.get(url, (res) => {
                        res.connection.destroy();
                        done(400 > res.statusCode);
                    }).on("error", cancel);
                });

            case "https":
                return new Promise<boolean>((done, cancel) => {
                    https.get(url, (res) => {
                        res.connection.destroy();
                        done(400 > res.statusCode);
                    }).on("error", cancel);
                });
        }

        return false;
    }
}
