import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import Jimp from "jimp/es";
const s3 = new AWS.S3();
const imagesBucketName = process.env.IMAGES_S3_BUCKET;
const thumbnailBucketName = process.env.THUMBNAILS_S3_BUCK;
export const handler = async (event) => {
    console.log('Processing SNS event ', JSON.stringify(event));
    for (const snsRecord of event.Records) {
        const s3EventStr = snsRecord.Sns.Message;
        /// <Model name~Inherit> Model type: Description
        console.log('Processing S3 event', s3EventStr);
        const s3Event = JSON.parse(s3EventStr);
        for (const record of s3Event.Records) {
            await processImage(record);
        }
    }
};
async function processImage(record) {
    const key = record.s3.object.key;
    console.log('Processing S3 item with key', key);
    const response = await s3.getObject({
        Bucket: imagesBucketName,
        Key: key
    }).promise();
    const body = response.Body.toString();
    const image = await Jimp.read(body);
    console.log('Resizing image');
    image.resize(150, Jimp.AUTO);
    const convertedBuffer = await image.getBufferAsync(Jimp.AUTO.toString());
    console.log('Writing image back to S3 bucket: ${thumbnailBucketName}');
    await s3.putObject({
        Bucket: thumbnailBucketName,
        Key: `${key}.jpeg`,
        Body: convertedBuffer
    }).promise();
}
//# sourceMappingURL=resizeImage.js.map