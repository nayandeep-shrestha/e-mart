import express, { Express, Request, Response, NextFunction} from "express";
import dotenv from 'dotenv';
import cors from "cors";
const app: Express = express();
import routes from './routes/';
import prisma from "./prisma";
import HttpException from './models/http-exception.model';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 8000;
declare global {
    namespace Express {
      interface Request {
        userId: number,
        role: string,
        upload_path: string 
      }
    }
  }
  
// app.use("/images", express.static(process.cwd() + "/public/uploads/"))
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(routes)

app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpException) {
    res.status(err.errorCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message || 'An unexpected error occurred' });
  }
});


// Close Prisma Client when the process exits
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});

app.listen(PORT, () => {        
    console.log('listening to port' + PORT)
})
