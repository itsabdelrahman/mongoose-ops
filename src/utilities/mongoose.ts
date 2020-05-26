import { Document, Types } from 'mongoose';
import R from 'ramda';

export const normalizeDocument = (document: Document): any => {
  return R.pipe(toObject, stringifyIdProps, R.dissoc('__v'))(document);
};

/* TODO: Account for nested IDs */
const stringifyIdProps = (object: any): any => {
  return R.map((value) => {
    if (value instanceof Types.ObjectId) {
      return value.toString();
    }

    return value;
  })(object);
};

const toObject = (document: Document): any => {
  return document.toObject();
};
