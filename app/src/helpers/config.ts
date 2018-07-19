const env = process.env;

export interface IConfig {
    /**
     * App config
     */
    app: {
        port: number,
    };
    /**
     * Redis config
     */
    redis: {
        host: string,
        port: number,
    };
    /**
     * Link helper config
     */
    links: {
        /**
         * Link id generation method
         */
        generateMethod: string,
    };
}

export const config: IConfig = {
    app: {
        port: parseInt(env.APP_PORT, 10) || 3000,
    },
    redis: {
        host: env.REDIS_HOST || "localhost",
        port: parseInt(env.REDIS_PORT, 10) || 63790,
    },
    links: {
        generateMethod: env.LINKS_GENERATE_METHOD || "shuffle",
    },
};
