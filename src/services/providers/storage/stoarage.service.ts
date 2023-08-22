import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import config from "config"
import { Request } from "express"
import multer from "multer"
import multerS3 from "multer-s3"
import { BadRequestError } from "../../../utils/errors"
import { Stream } from "stream"

const validFileFormats = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "text/csv",
    "audio/mpeg",
    "audio/mp4",
    "audio/mp3",
    "audio/ogg",
    "audio/vnd.wav",
    "audio/wave",
    "video/mp4",
    "video/3gpp",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/x-flv",
    "application/pdf",
])

const fileFilterFunction = (
    req: Request,
    file: any,
    cb: (err: any, boo?: Boolean) => {}
) => {
    if (validFileFormats.has(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new BadRequestError("Invalid file type"))
    }
}

const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: config.get<string>("aws.accessKeyId"),
        secretAccessKey: config.get<string>("aws.secretAccessKey"),
    },
})

export class StorageService {
    public upload = multer({
        fileFilter: fileFilterFunction,
        limits: {
            parts: Infinity,
            fileSize: 1024 * 1024 * 250, //Maximum of 200Mb file size
        },
        storage: multerS3({
            s3: s3,
            bucket: "be-practice",
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname })
            },
            key: function (req, file, cb) {
                cb(null, `${file.originalname}-${Date.now().toString()}`)
            },
        }),
    })

    public async getObject(key: string, range?: string): Promise<Stream> {
        const input = {
            Bucket: "be-practice",
            Key: key,
        }

        const command = new GetObjectCommand(input)
        const response = await s3.send(command)

        return response.Body as Stream
    }
}
