import 'dotenv/config'

//console.log(process.env);
import express from "express";
import fetch from "node-fetch";
import proxy from 'express-http-proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { Post } from "./helpers/post.js";
import { colors } from './helpers/log.js';
import { rating } from './helpers/regex.js';

let baseURL = process.env.BASEURL_SZURUBOORU || "http://szurubooru.int";
let redirectURL = process.env.REDIRECTURL_INTERNAL_STACK || "http://172.20.1.3";
let debug = !!(+process.env.DEBUG || false);

redirectURL = redirectURL == `client` ? `http://${redirectURL}` : redirectURL

const app = express();
app.use((req, res, next) => {
    debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] ${req.socket.remoteAddress} request ${req.url}`) : "";
    next();
})

app.use('/api/uploads', createProxyMiddleware({
    target: `${redirectURL}`,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logger: console,
}));

if (debug == true) {
    /*app.use('/api/posts*', proxy(`${redirectURL}`, {
        proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
          proxyReqOpts.headers['accept'] = 'application/json';
          proxyReqOpts.headers['content-type'] = 'application/json';
          proxyReqOpts.headers['cookie'] = srcReq.headers.cookie;
          return proxyReqOpts;
        }
      }));*/
    app.get('/api/posts*', async (req, res) => {
        console.log(req.headers);
        console.log (`${redirectURL}${req.url}`);
        let fet = await fetch(`${redirectURL}${req.url}`, {
            "headers": {
                ...req.headers
            },
            "body": null,
            "method": "GET"
        });
        res.json(await fet.json());
    })
}
app.get('/posts.json?*', async (req, res) => {
    debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] ${req.socket.remoteAddress} got request query ${req.query.toString()}`) : "";
    let url = `${redirectURL}/api/posts?`
    for (var k in req.query) {
        if (k === "tags") {
            let tags = req.query[k];
            let tag = tags.split(" ");
            for (let t in tag) {
                tag[t] = decodeURIComponent(tag[t])
                console.log(tag[t]);
                if (tag[t].includes("rating")) {
                    tag[t] = rating(tag[t]);
                }
            }
            tags = tag.join(" ");
            console.log(tags);
            url += `query=${tags}&`;
            continue;
        }
        url += `${k}=${req.query[k]}&`;
        if (k === "limit") {
            if (typeof req.query['page'] != "undefined") {
                let offset = req.query['page'] * req.query['limit'] - req.query['limit'];
                url += `offset=${offset}&`;
            }

        }
    }
    debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] ${req.socket.remoteAddress} request SZURUBOORU api with url ${url}`) : "";
    let fet = await fetch(`${url}`, {
        "headers": {
            "accept": "application/json",
            "content-type": "application/json"
        },
        "body": null,
        "method": "GET"
    });
    //debug ? console.dir(fet) : "";
    let json = await fet.json();

    //console.log(json);
    let result = { posts: [] }
    for (let post in json.results) {
        //json.results[post]
        //debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] create Object of Post`) : "";
        let p = new Post();
        p.id = json.results[post].id;
        // FILE
        p.file = {
            width: json.results[post].canvasWidth,
            height: json.results[post].canvasHeight,
            md5: json.results[post].checksumMD5,
            url: `${baseURL}/${json.results[post].contentUrl}`,
            ext: json.results[post].mimeType.split('/')[1]
        }
        //PREVIEW
        p.preview = {
            width: 150,
            height: 84,
            url: `${baseURL}/${json.results[post].thumbnailUrl}`
        }
        // Sample
        p.sample = {
            has: true,
            alternates: {},
            width: json.results[post].canvasWidth,
            height: json.results[post].canvasHeight,
            url: `${baseURL}/${json.results[post].contentUrl}`
        }
        let safety = {
            "safe": "s",
            "sketchy": "q",
            "unsafe": "e"
        }
        p.rating = safety[json.results[post].safety] || "e"
        //p.rating = json.results[post].safety == "safe" ? "" : "e"  
        p.created_at = json.results[post].created_at;
        p.updated_at = json.results[post].lastEditTime == null ? json.results[post].created_at : json.results[post].lastEditTime;





        let tag = {};
        for (var l = 0; l < json.results[post].tags.length; l++) {
            let oneTag = json.results[post].tags[l];
            let name = oneTag.names;
            let cat = oneTag.category;
            if (typeof tag[cat] == "undefined") {
                tag[cat] = [];
            }
            tag[cat].push(name[0]);
        }
        p.tags = tag;
        //debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] added Post ${p.id} to json`) : "";
        result.posts.push(p);
    }

    debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] ${req.socket.remoteAddress} got request query ${JSON.stringify(req.query)}`) : "";
    debug ? console.log(`[${colors.FgCyan}Debug${colors.Reset}] ${req.socket.remoteAddress} send Posts.json to client`) : ""
    res.send(result);
});

/*
Not working 
sometimes entity to large (413) or method not allowed 405
app.use("/api/uploads",proxy(`${redirectURL}/api/uploads`,{
    limit: 10 * 1024 * 1024 * 1024
}));
*/
app.use(proxy(redirectURL));


app.listen(5432,()=>{
    console.log(`[${colors.FgCyan}Debug${colors.Reset}] online`)
});