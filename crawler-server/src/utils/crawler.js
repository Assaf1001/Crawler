const Axios = require("axios");
const { Tree } = require("./tree");

const crawlerServerAddress = process.env.CRAWLER_SERVER_ADDRESS;

const workers = [
    { address: process.env.WORKER_ADDRESS_1, avaliable: true },
    { address: process.env.WORKER_ADDRESS_2, avaliable: true },
    { address: process.env.WORKER_ADDRESS_3, avaliable: true },
];
// const workers = [
//     process.env.WORKER_ADDRESS_1,
//     process.env.WORKER_ADDRESS_2,
//     process.env.WORKER_ADDRESS_3,
// ];

let queueUrl;
let tree;
let maxTotalPages,
    maxDepth,
    pagesCounter,
    currentDepth = 0,
    pagesLeftInSqs = 0;

let isDepthDone;
let isCralwerDone;

const initializeRedisDB = async () => {
    try {
        const res = await Axios.post(`${crawlerServerAddress}/init`);

        console.log(res.data);
    } catch (err) {
        throw new Error("DB inititalize has falied");
    }
};

const createSqsQueue = async () => {
    try {
        const createQueue = await Axios.post(
            `${crawlerServerAddress}/create-queue`
        );
        const queueUrl = createQueue.data.queueUrl;

        console.log("Sqs queue created,", queueUrl);
        return queueUrl;
    } catch (err) {
        throw new Error("Sqs queue creation has failed");
    }
};

const deleteSqsQueue = async () => {
    try {
        const deleteQueue = await Axios.post(
            `${crawlerServerAddress}/delete-queue`,
            { queueUrl }
        );

        console.log(deleteQueue.data);
    } catch (err) {
        throw new Error("Sqs queue delete has failed");
    }
};

const scrapeFirstPage = async (url) => {
    try {
        await Axios.post(`${workers[0].address}/scrape-page`, {
            url,
            depth: currentDepth,
        });
    } catch (err) {
        throw new Error("First scrape has failed");
    }
};

// const scrapePagesFromWorkers = async (queueUrl) => {
//     try {
//         await Axios.all([
//             Axios.post(`${workers[0]}/scrape-page`, {
//                 queueUrl,
//                 depth: currentDepth,
//             }),
//             Axios.post(`${workers[1]}/scrape-page`, {
//                 queueUrl,
//                 depth: currentDepth,
//             }),
//             Axios.post(`${workers[2]}/scrape-page`, {
//                 queueUrl,
//                 depth: currentDepth,
//             }),
//         ]).then((res) => {
//             console.log(res);
//             pagesLeftInSqs -= 3;
//             console.log(pagesLeftInSqs);
//         });
//     } catch (err) {
//         throw new Error(err);
//     }
// };

let num = 0;

const scrapePagesFromWorkers = async () => {
    try {
        await Axios.post(`${workers[num].address}/scrape-page`, {
            queueUrl,
            depth: currentDepth,
        }).then((res) => {
            console.log(workers[num].address);
            num++;
            if (num === 3) num = 0;
        });
        return;
    } catch (err) {
        // throw new Error("Failed to scrape pages");
        console.log(err);
    }
};
// const scrapePagesFromWorkers = async () => {
//     try {
//         for (let worker of workers) {
//             if (worker.avaliable) {
//                 worker.avaliable = false;
//                 await Axios.post(`${worker.address}/scrape-page`, {
//                     queueUrl,
//                     depth: currentDepth,
//                 }).then((res) => {
//                     console.log(worker.address);
//                     worker.avaliable = true;
//                 });
//                 return;
//             }
//         }
//     } catch (err) {
//         // throw new Error("Failed to scrape pages");
//         console.log(err);
//     }
// };

const insertLinksToSqsQueue = async (title, links) => {
    try {
        console.log("Uploading links to sqs queue", queueUrl);

        for (let link of links) {
            console.log(link);
            if (pagesCounter >= maxTotalPages) {
                isCralwerDone = true;
                break;
            }

            await Axios.post(`${crawlerServerAddress}/send-message`, {
                queueUrl,
                title,
                messageBody: link,
            });
            pagesCounter++;
            pagesLeftInSqs++;
        }
        console.log(`Total pages inserted to sqs:`, pagesLeftInSqs);
    } catch (err) {
        // throw new Error("Faild to insert links to sqs");
        console.log(err);
    }
};

const addToTree = ({ parentAddress, pageObj }) => {
    const node = tree.createNode(pageObj);

    console.log("add to tree", parentAddress, node.depth);

    if (node.depth === 0) tree.setRoot(node);
    else if (node.depth === 1) tree.root.addChild(node);
    else {
        const parentNode = tree.getNodeByAddress(parentAddress);
        parentNode.addChild(node);
    }
};

const getPageFromRedis = async (key) => {
    try {
        const res = await Axios.post(`${crawlerServerAddress}/get-string`, {
            key,
        });

        return res.data;
    } catch (err) {
        throw new Error("Failed to get value from redis");
    }
};

const getDataFromWorker = async (key) => {
    console.log("data from worker", key);
    try {
        if (isCralwerDone && pagesLeftInSqs <= 0) return crawlerDone();

        const { parentAddress, pageObj } = await getPageFromRedis(key);
        addToTree({ parentAddress, pageObj });

        if (!isDepthDone && pagesLeftInSqs <= 0) {
            isDepthDone = true;
            await handleDepth(pageObj.links);
        }
    } catch (err) {
        // throw new Error("Failed to get data from worker");
        console.log("Failed to get data from worker", err.response);
    }
};

const handleDepth = async (links) => {
    try {
        if (currentDepth === 0) {
            await insertLinksToSqsQueue("0", links);
            currentDepth++;
        } else {
            await getNextDepth(queueUrl);
        }
        console.log("current Depth", currentDepth);

        while (pagesLeftInSqs > 0) {
            await scrapePagesFromWorkers(queueUrl);
            await Axios.post(`${crawlerServerAddress}/set-tree`, { tree });
            pagesLeftInSqs--;
            console.log("pages left in sqs", pagesLeftInSqs);
        }

        // await deleteSqsQueue(queueUrl);

        isDepthDone = false;

        if (currentDepth <= maxDepth && !isDepthDone) handleDepth();
        else crawlerDone();
    } catch (err) {
        console.log(err);
    }
};

const getNextDepth = async () => {
    console.log("scrape next depth", currentDepth);
    const nextDepthNodes = tree
        .bfsTraverse()
        .filter((node) => node.depth === currentDepth);

    for (let node of nextDepthNodes) {
        if (!isCralwerDone) {
            await insertLinksToSqsQueue(node.address, node.links);
        }
    }
    currentDepth++;
};

const crawler = async (searchObj) => {
    pagesCounter = 0;
    currentDepth = 0;
    maxTotalPages = searchObj.maxTotalPages;
    maxDepth = searchObj.maxDepth;

    isDepthDone = false;
    isCralwerDone = false;

    tree = new Tree();

    try {
        await initializeRedisDB();
        queueUrl = await createSqsQueue();

        await scrapeFirstPage(searchObj.startUrl);
    } catch (err) {
        throw new Error(err);
    }
};

const crawlerDone = async () => {
    isCralwerDone = true;
    console.log("done");
    try {
        await deleteSqsQueue(queueUrl);
        await Axios.post(`${crawlerServerAddress}/crawler-done`);
    } catch (err) {
        throw new Error();
    }
};

module.exports = { crawler, getDataFromWorker };
