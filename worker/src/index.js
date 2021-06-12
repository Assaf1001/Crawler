const express = require("express");
const cors = require("cors");
const scrapeRouter = require("./routers/scrapeRouter");
const redisRouter = require("./routers/redisRouter");

const port = process.argv[2];

const app = express();

app.use(express.json());
app.use(cors());
app.use(scrapeRouter);
app.use(redisRouter);

app.get("*", (req, res) => {
    res.send("OK");
});

app.listen(port, () => console.log("Server is connected, Port", port));
