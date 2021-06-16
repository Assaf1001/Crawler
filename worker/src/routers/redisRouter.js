const express = require("express");
const redisClient = require("../db/redis");

const router = new express.Router();

router.post("/set-string", async (req, res) => {
    try {
        const jsonPage = JSON.stringify(req.body.value);
        await redisClient.setAsync(req.body.key, jsonPage);

        res.send("ok");
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
