const AWS = require("aws-sdk");

const sqs = new AWS.SQS({
    apiVersion: "2012-11-05",
    region: process.env.AWS_REGION,
});

const recieveMessage = async (req, res, next) => {
    const QueueUrl = req.body.queueUrl;

    if (QueueUrl) {
        try {
            const { Messages: Message } = await sqs
                .receiveMessage({
                    QueueUrl,
                    MaxNumberOfMessages: 1,
                    MessageAttributeNames: ["All"],
                    VisibilityTimeout: 1,
                    WaitTimeSeconds: 1,
                })
                .promise();

            req.message = Message[0] || null;

            next();

            if (Message) {
                await sqs
                    .deleteMessage({
                        QueueUrl,
                        ReceiptHandle: req.message.ReceiptHandle,
                    })
                    .promise()
                    .then();
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else {
        next();
    }
};

module.exports = { recieveMessage };
