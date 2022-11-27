import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import routerUser from './routes/users';
import routerCard from './routes/cards';
import { Request, Response } from 'express';
import path from 'path';
import { IError } from './types';
import { SERVER_ERROR_STATUS } from './constants/status';
import { createUser, login } from './controllers/users';
import cookieParser from 'cookie-parser';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import { errors } from 'celebrate';
const { PORT = 3000 } = process.env;


const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, 'public')))

app.use(requestLogger)
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth as unknown as express.RequestHandler);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use(errors());
app.use(errorLogger);


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


