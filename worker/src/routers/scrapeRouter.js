const express = require("express");
const Axios = require("axios");
const { recieveMessage } = require("../middleware/sqs");
const scrapePage = require("../utils/scrapePage");

const router = new express.Router();
const crawlerServerAddress = process.env.CRAWLER_SERVER_ADDRESS;
const workerAddress = `http://localhost:${process.argv[2]}`;

// router.post("/scrape-first-page", async (req, res) => {
//     const pageUrl = req.body.url;
//     const depth = req.body.depth;

//     try {
// const pageObj = await scrapePage(pageUrl, depth);

// if (pageObj) {
//     await Axios.post(`${workerAddress}/set-string`, {
//         key: pageUrl,
//         value: pageObj,
//     });
// }

// res.send(pageObj);
//         console.log(workerAddress);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

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

// router.post("/scrape-page", recieveMessage, async (req, res) => {
//     const pageUrl = req.body.url || req.message.Body;
//     const depth = req.body.depth;

//     try {
//         const pageObj = await scrapePage(pageUrl, depth);

//         if (pageObj)
//             await Axios.post(`${workerAddress}/set-string`, {
//                 key: pageObj.url,
//                 value: pageObj,
//             });

//         if (req.body.url) {
//             res.send(pageObj);
//         } else {
//             res.send("ok");
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

module.exports = router;
