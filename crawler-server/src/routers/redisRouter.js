const express = require("express");
const redisClient = require("../db/redis");

const router = new express.Router();

router.post("/init", async (req, res) => {
    try {
        await redisClient.flushallAsync();

        res.send("DB initialized");
    } catch (err) {
        res.status(500).send(err);
    }
});

// router.post("/set-string", async (req, res) => {
//     try {
//         const key = await redisClient.setAsync(req.body.key, req.body.value);
//         console.log(key);

//         res.send();
//     } catch (err) {
//         console.log(err);
//     }
// });

router.post("/set-tree", async (req, res) => {
    try {
        const tree = JSON.stringify(req.body.tree);
        await redisClient.setAsync("tree", tree);

        res.send("ok");
    } catch (err) {
        console.log(err);
    }
});

router.get("/get-tree", async (req, res) => {
    try {
        const jsonValue = await redisClient.getAsync("tree");
        const value = JSON.parse(jsonValue);

        res.send(value);
    } catch (err) {
        console.log(err);
    }
});

router.post("/get-string", async (req, res) => {
    const key = req.body.key;

    try {
        const jsonValue = await redisClient.getAsync(key);
        const value = JSON.parse(jsonValue);

        res.send(value);
    } catch (err) {
        console.log(err);
    }
});

// router.post("/addPageToList", async (req, res) => {
//     try {
//         const jsonPage = JSON.stringify(req.body.pageObj);
//         await redisClient.rpushAsync("pages", jsonPage);

//         res.send("OK");
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.get("/getPages", async (req, res) => {
    try {
        const jsonPages = await redisClient.lrangeAsync("pages", 0, -1);

        const pages = [];
        for (let jsonPage of jsonPages) {
            pages.push(JSON.parse(jsonPage));
        }

        res.send(pages);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
