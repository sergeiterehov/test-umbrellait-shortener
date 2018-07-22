# Test task: shortener

## How to run?

First, needs initialize database:

```bash
docker-compose up -d mysql
```

after that application can will be started.

```bash
docker-compose up -d
```

## Main structure

Project splitted in 2 parts:
* app;
* frontend.

### **App** annotation

Application was written on TypeScript and located in `src`. Compiled JS-files will be located in `dist`.

Config was located in `helpers/config`

Used `Express.js` framework.

Used `PUG` as main HTML renderer. Views was located in `views`.

Used `TypeORM` object-relation model for `MySQL`.

Used `Redis` for cache.

### **App** structure

The main file is `index.ts`, which creats mysql connection and startes 2 web entry points:
* **app** (app.ts) - main web-application;
* **local** (local.ts) - private local services.

Using 3 main route:
* `/` - index page with main functions for creating short links;
* `/api/v1` - entry point to the api;
* `/:id` - any id of the short link.

> Middlewares was realized in the route definitions.

### **Frontend** annotation

Frontend includes static resources for the client side. Also was writted on TypeScript. Public accessible dirrectory is `public`.

`source` containing `React` based client application **shortenner**, usses for createing short links and display the statistics.

Building system is `Webpack`.

## Configuration

For define config values uses **environment** (*see docker-compose.yml*).

## How is the short links creating?

`helpers/LinkHelper` has method `createLink`, which:
* generats pseudo-random link `id`;
* creates record in DB, if not exists collision;
* calls the link checker `checkLink` on the background;
* sends result to client (the link id).

> If target URL is unavailable, link will be delete. Before that the short link is unavailable.

## Counters

Сounters of opening stores in the RedisDB by hash-record `opncnt`. Uses local method `/cache/flush-counters`.

> Every 1 minute cached values moves to main MySQL database.

## TTL of links

Links stores up to 15 days and will be removed after that. Uses local method `/links/delete-old`.