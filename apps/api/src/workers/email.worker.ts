import { Worker } from 'bullmq';
import AWS from 'aws-sdk';
import { connection } from './email.queue';

const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_SES_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
});

new Worker(
  'email',
  async job => {
    const { to, subject, body } = job.data;

    await ses.sendEmail({
      Source: process.env.SES_FROM_EMAIL!,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: body },
        },
      },
    }).promise();
  },
  { connection }
);
