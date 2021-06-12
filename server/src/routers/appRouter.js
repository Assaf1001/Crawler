const express = require("express");
const Axios = require("axios");

const router = new express.Router();

const crawlerServerAddress = process.env.CRAWLER_SERVER_ADDRESS;

router.post("/crawler-start", (req, res) => {
    const searchObj = req.body.searchObj;

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
        res.send("Cralwer has done");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
