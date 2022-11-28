import { celebrate, Joi } from 'celebrate';
import { urlRegExp } from '../constants/auth';

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri().pattern(urlRegExp).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }).unknown(true),
});
