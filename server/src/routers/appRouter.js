const express = require("express");
const Axios = require("axios");

const router = new express.Router();

const crawlerServerAddress = process.env.CRAWLER_SERVER_ADDRESS;
let isCrawlerDone = false;

router.post("/crawler-start", (req, res) => {
    const searchObj = req.body.searchObj;
    isCrawlerDone = false;

    try {
        Axios.post(`${crawlerServerAddress}/crawler-search`, {
            searchObj,
        });

        res.send("Crawler in process");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/crawler-end", async (req, res) => {
    try {
        console.log("Crawler has done");
        isCrawlerDone = true;
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/is-crawler-done", (req, res) => {
    try {
        if (isCrawlerDone) res.send(true);
        else res.send(false);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
