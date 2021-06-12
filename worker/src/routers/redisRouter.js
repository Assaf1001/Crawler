const express = require("express");
const redisClient = require("../db/redis");

const router = new express.Router();

// router.post("/init", async (req, res) => {
//     try {
//         await redisClient.flushallAsync();

//         res.send("DB initialized");
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

router.post("/set-string", async (req, res) => {
    try {
        const jsonPage = JSON.stringify(req.body.value);
        await redisClient.setAsync(req.body.key, jsonPage);

        res.send("ok");
    } catch (err) {
        console.log(err);
    }
});

// router.get("/get-string/:key", async (req, res) => {
//     try {
//         const jsonValue = await redisClient.getAsync(req.params.key);
//         const value = JSON.parse(jsonValue);

//         res.send({ value });
//     } catch (err) {
//         console.log(err);
//     }
// });

// router.post("/addPageToList", async (req, res) => {
//     try {
//         const jsonPage = JSON.stringify(req.body.pageObj);
//         await redisClient.rpushAsync("pages", jsonPage);

//         res.send("OK");
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// router.get("/getPages", async (req, res) => {
//     try {
//         const jsonPages = await redisClient.lrangeAsync("pages", 0, -1);

//         const pages = [];
//         for (let jsonPage of jsonPages) {
//             pages.push(JSON.parse(jsonPage));
//         }

//         res.send(pages);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

module.exports = router;
