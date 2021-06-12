const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");

const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    region: process.env.AWS_REGION,
});

const createQueue = async (req, res, next) => {
    try {
        const data = await sqs
            .createQueue({
                QueueName: `${nanoid()}.fifo`,
                Attributes: {
                    FifoQueue: "true",
                },
            })
            .promise();

        req.queueUrl = data.QueueUrl;
        next();
    } catch (err) {
        res.status(500).send(err);
    }
};

const sendMessageToQueue = async (req, res, next) => {
    const QueueUrl = req.body.queueUrl;
    const MessageBody = req.body.messageBody;
    const title = req.body.title;

    try {
        const { MessageId } = await sqs
            .sendMessage({
                QueueUrl,
                MessageGroupId: "2",
                MessageDeduplicationId: nanoid(),
                MessageAttributes: {
                    title: {
                        DataType: "String",
                        StringValue: title,
                    },
                },
                MessageBody,
            })
            .promise();

        req.messageId = MessageId;
        next();
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteQueue = async (req, res, next) => {
    const QueueUrl = req.body.queueUrl;

    try {
        await sqs.deleteQueue({ QueueUrl }).promise();
        next();
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {
    createQueue,
    sendMessageToQueue,
    deleteQueue,
};
