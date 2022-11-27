import mongoose, { Schema, Date, Types } from 'mongoose';
import { urlRegExp } from '../constants/auth';

interface ICard {
  name: string,
  link: string,
  owner: Types.ObjectId,
  likes: [Types.ObjectId],
  createdAt: Date
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url:string) {
        return urlRegExp.test(url);
      },
      message: (props) => `${props.value} некорректный URL!`,
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    ref: 'likes',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
