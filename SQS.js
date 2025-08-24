// https://www.npmjs.com/package/@aws-sdk/client-sqs
// https://www.youtube.com/watch?v=EKaklEUB_yA

const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

export class SQS {
    #accessKeyId;
    #secretAccessKey;
    #region;
    #sqs;

    constructor() {
        this.#accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        this.#secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        this.#region = process.env.IMAGES_S3_REGION;

        this.#sqs = new SQSClient({
            region: this.#region,
            credentials: {
                accessKeyId: this.#accessKeyId,
                secretAccessKey: this.#secretAccessKey,
            },
        });
    }

    async sendMessage(message) {
        const input = {
            QueueUrl: "https://sqs.us-east-1.aNALYTICS",
            MessageBody: message,
            DelaySeconds: Number("10"),
        };
        const command = new SendMessageCommand(input);
        const response = await this.#sqs.send(command);
    }
}
