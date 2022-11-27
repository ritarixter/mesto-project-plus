import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { urlRegExp } from '../constants/auth';
import UnauthorizedError from '../errors/UnauthorizedErr';

interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password:string
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
  Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: [2, 'Должно быть минимум 2 буквы, получено {VALUE}'],
    maxlength: [30, 'Должно быть максимум 30 буквы, получено {VALUE}'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Должно быть минимум 2 буквы, получено {VALUE}'],
    maxlength: [200, 'Должно быть максимум 200 буквы, получено {VALUE}'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url:string) {
        return urlRegExp.test(url);
      },
      message: (props) => `${props.value} некорректный URL!`,
    },
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'обязательное поле для заполнения'],
    validate: {
      validator(email: string) {
        return validator.isEmail(email);
      },
      message: 'Введен некорректный e-mail',
    },
  },
  password: {
    type: String,
    required: [true, 'обязательное поле для заполнения'],
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched:boolean) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
});

export default mongoose.model<IUser, IUserModel>('user', userSchema);
