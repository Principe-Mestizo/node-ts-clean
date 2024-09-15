import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";



export class FileUploadService {
    constructor(
        private readonly uuid = Uuid.v4,
    ) { }


    private checkFolder(folderPath: string) {

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

     public async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtension: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        try {

            const fileExtension = file.mimetype.split('/').at(1) ?? '';
            if (!validExtension.includes( fileExtension )) {
                throw CustomError.badRequest(`Invalid eextension: ${fileExtension}`)
            }

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder( destination );

            const fileName = `${this.uuid()}.${fileExtension}`

            file.mv(`${destination}/${fileName}`);

            return { fileName }
        } catch (error) {
            console.log({ error });
        }

    }

    public async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtension: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {

        const  fileNames = await Promise.all(
            files.map( file => this.uploadSingle( file, folder, validExtension))
        )

        return fileNames;
    }


}