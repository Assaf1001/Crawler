const express = require("express");
const {
    createQueue,
    sendMessageToQueue,
    deleteQueue,
} = require("../middleware/sqs");

const router = new express.Router();

router.post("/create-queue", createQueue, async (req, res) => {
    try {
        res.send({ queueUrl: req.queueUrl });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/send-message", sendMessageToQueue, async (req, res) => {
    try {
        res.send({ messageId: req.messageId });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/delete-queue", deleteQueue, async (req, res) => {
    try {
        res.send("Queue Deleted");
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
