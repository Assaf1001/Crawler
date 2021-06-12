const express = require("express");
const cors = require("cors");
const appRouter = require("./routers/appRouter");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(appRouter);

app.get("*", (req, res) => {
    res.send("ok");
});

app.listen(port, () => console.log("Server is connected, Port:", port));
