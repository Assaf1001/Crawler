const express = require("express");
const Axios = require("axios");
const { crawler, getDataFromWorker } = require("../utils/crawler");

const router = new express.Router();

const serverAddress = process.env.SERVER_ADDRESS;

router.post("/crawler-search", async (req, res) => {
    const searchObj = req.body.searchObj;

    try {
        crawler(searchObj);
        res.send(`ok`);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/get-page-key", async (req, res) => {
    const key = req.body.key;

    try {
        getDataFromWorker(key);
        res.send("ok");
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/crawler-done", async (req, res) => {
    try {
        await Axios.post(`${serverAddress}/crawler-end`);
        res.send();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
