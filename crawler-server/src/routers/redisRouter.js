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
        const jsonTree = await redisClient.getAsync("tree");
        const tree = JSON.parse(jsonTree);

        res.send(tree);
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

module.exports = router;
