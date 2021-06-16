const express = require("express");
const Axios = require("axios");
const { recieveMessage } = require("../middleware/sqs");
const scrapePage = require("../utils/scrapePage");

const router = new express.Router();
const crawlerServerAddress = process.env.CRAWLER_SERVER_ADDRESS;
const workerAddress = `http://localhost:${process.argv[2]}`;

router.post("/scrape-page", recieveMessage, async (req, res) => {
    const pageUrl = req.body.url || req.message.Body;
    const depth = req.body.depth;
    const parentAddress =
        req.message?.MessageAttributes.title.StringValue || "";

    try {
        res.send();

        const pageObj = await scrapePage(pageUrl, depth);

        if (pageObj) {
            await Axios.post(`${workerAddress}/set-string`, {
                key: pageObj.url,
                value: { parentAddress, pageObj },
            });

            await Axios.post(`${crawlerServerAddress}/get-page-key`, {
                key: pageObj.url,
            });

            console.log(pageObj.url);
        }
    } catch (err) {
        res.status(500).send(err);
        // console.log(err);
    }
});

module.exports = router;
