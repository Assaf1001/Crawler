const express = require("express");
const cors = require("cors");
const sqsRouter = require("./routers/sqsRouter");
const redisRouter = require("./routers/redisRouter");
const crawlerRouter = require("./routers/crawlerRouter");

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());
app.use(sqsRouter);
app.use(redisRouter);
app.use(crawlerRouter);

app.get("*", (req, res) => {
    res.send("OK");
});

app.listen(port, () => console.log("Server is connected, Port", port));
