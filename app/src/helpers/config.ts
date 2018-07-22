const env = process.env;

export interface IConfig {
    /**
     * App config
     */
    app: {
        port: number,
    };
    /**
     * Mysql default connection
     */
    mysql: {
        host: string,
        port: number,
        username: string,
        password: string,
        database: string,
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
        /**
         * Time to live in days
         */
        ttl: number,
    };
}

export const config: IConfig = {
    app: {
        port: env.APP_PORT ? parseInt(env.APP_PORT, 10) : 80,
    },
    mysql: {
        host: env.MYSQL_HOST || "localhost",
        port: env.MYSQL_PORT ? parseInt(env.REDIS_PORT, 10) : 3306,
        username: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DB,
    },
    redis: {
        host: env.REDIS_HOST || "localhost",
        port: env.REDIS_PORT ? parseInt(env.REDIS_PORT, 10) : 6379,
    },
    links: {
        generateMethod: env.LINKS_GENERATE_METHOD || "shuffle",
        ttl: env.LINKS_TTL ? parseInt(env.LINKS_TTL, 10) : 15,
    },
};
