import { celebrate, Joi } from 'celebrate';
import { urlRegExp } from '../constants/auth';

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    link: Joi.string().pattern(urlRegExp).required(),
    owner: Joi.required(),
  }).unknown(true),
});
