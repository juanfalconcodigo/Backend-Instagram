require('dotenv').config({ path: '.env' });
const AWS = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const awsUploadImage = async(file, filePath) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `${filePath}`,
        Body: file
    }

    try {
        const response = await s3.upload(params).promise();
        return response.Location;

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

const awsDeleteImage = async(filePath) => {
    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: `publication/${filePath}`
    };
    try {
        await s3.deleteObject(params).promise();
        return true;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


module.exports = {
    awsUploadImage,
    awsDeleteImage
};