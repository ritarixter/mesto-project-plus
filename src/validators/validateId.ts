import { celebrate, Joi } from 'celebrate';

export default celebrate({
  params: {
    id: Joi.string().hex().length(24).required(),
  },
});
