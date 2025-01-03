import * as fs from 'fs';
import multer = require('multer')
import {Request} from 'express'
const diskStore = multer.diskStorage({
    destination: (req:Request, file:Express.Multer.File,cb) => {
        fs.mkdirSync(req.upload_path, {recursive: true})
        cb(null, req.upload_path);
    },
    filename: (req:Request, file,cb) => {
        let file_name= Date.now() + file.originalname;
        cb(null, file_name)
    }
})


const storage = multer.memoryStorage();
const imgFilter = (req:Request, file:Express.Multer.File,cb: CallableFunction) =>{
    let ext = (file.originalname.split(".")).pop()
    if(["jpeg","jpg","png","webp","svg", "bmp"].includes(ext!.toLowerCase())){
        cb(null, true)
    }else{
        cb({status:400, msg:"Invalid image format"}, null)
    }
}

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 4*1024*1024,
    },
    fileFilter: imgFilter
})
module.exports = uploader