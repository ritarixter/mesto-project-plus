import { celebrate, Joi } from 'celebrate';

export default celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }).unknown(true),
});
