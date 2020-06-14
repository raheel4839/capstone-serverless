import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
const logger = createLogger('dataLogger')
const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })

export class AdS3 {

  constructor(
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.URL_EXPIRATION
    ) {
  }

   generateImageURL(adId:string): string {
    logger.info(`generating image url for adId ${adId}`)
    const url = s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: adId,
      Expires: parseInt(this.urlExpiration)
    })
    return  JSON.stringify({
      url: url,
      bucketName: this.bucketName
    })
  }

}