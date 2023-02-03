import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import validateLogin from './validators/validateLogin';
import validateUser from './validators/validateUser';
import routerUser from './routes/users';
import routerCard from './routes/cards';
import { IError } from './types';
import { SERVER_ERROR_STATUS } from './constants/status';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger);
app.post('/signin', validateLogin, login);
app.post('/signup', validateLogin, validateUser, createUser);
app.use(auth as unknown as express.RequestHandler);
app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use(errors());
app.use(errorLogger);

app.use((err: IError, req:Request, res: Response) => {
  const { statusCode = SERVER_ERROR_STATUS, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(+PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
