import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import routerUser from './routes/users';
import routerCard from './routes/cards';
import { Request, Response } from 'express';
import path from 'path';
import { IError } from './types';
import { SERVER_ERROR_STATUS } from './constants/status';
const { PORT = 3000 } = process.env;


const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')

app.use((req:Request, res:Response, next: NextFunction) => {
  req.user = {
    _id: '637a5d05a017389b0aa6ac40'
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', routerUser);
app.use('/cards', routerCard);


app.use((err: IError, req:Request, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_STATUS
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(+PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})


