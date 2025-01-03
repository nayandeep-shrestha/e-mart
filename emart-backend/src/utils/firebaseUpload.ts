import { bucket } from "../firebase";

export const imageUploadToFirebase = async (images: Express.Multer.File[], folder?: string) : Promise<string[]>=> {
    const uploadPromises = images.map((file: Express.Multer.File) => {
        const blob = bucket.file(`uploads/${folder? folder + '/' : ''}${file.originalname}`);
        const blobStream = blob.createWriteStream({
          metadata: { contentType: file.mimetype },
        });
        return new Promise<string>((resolve, reject) => {
          blobStream.on("error", (err: Error) => {
            reject(err);
          });
          blobStream.on("finish", async () => { 
          try {
            await blob.makePublic(); // Make the file public
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            resolve(publicUrl);
          } catch (err) {
            reject(err);
          }
        });
          blobStream.end(file.buffer);
        });
      });
      const imageUrls = await Promise.all(uploadPromises);
      return imageUrls
}