import { celebrate, Joi } from 'celebrate';
import { urlRegExp } from '../constants/auth';

export default celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(urlRegExp).required(),
  }).unknown(true),
});
