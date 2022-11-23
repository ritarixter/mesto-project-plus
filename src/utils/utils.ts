import { ERROR_ON_SERVER_MESSAGE } from '../constants/message';
import BadRequestError from '../errors/badRequestErr';
import ConfictError from '../errors/confictErr';
import ServerError from '../errors/serverErr';

function validationCheck(err: { name: string; code: number;}) {
  if (err.name === 'ValidationError') {
    throw new BadRequestError('Некорректные данные');
  } else if (err.code === 11000) {
    throw new ConfictError('Произошёл конфликт запроса с текущим состоянием сервера');
  } else if (err.name === 'CastError') {
    throw new BadRequestError('Произошла ошибка');
  } else {
    throw new ServerError(ERROR_ON_SERVER_MESSAGE);
  }
}

export default validationCheck;
