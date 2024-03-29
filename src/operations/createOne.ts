import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';
import { CreateOneOptions } from '../types';

/**
 * Inserts a document in a collection.
 */
const createOne = <T>(model: Model<Document>) => async (
  options: CreateOneOptions<T>,
): Promise<T> => {
  const { document } = options;

  const createdDocument = await model.create(document);

  return normalizeDocument(createdDocument);
};

export default createOne;
