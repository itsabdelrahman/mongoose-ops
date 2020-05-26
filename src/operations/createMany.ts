import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';
import { CreateManyOptions } from '../types';

/**
 * Inserts multiple documents in a collection.
 */
const createMany = <T>(model: Model<Document>) => async (
  options: CreateManyOptions<T>,
): Promise<T[]> => {
  const { documents } = options;

  const createdDocuments = await model.insertMany(documents);

  return createdDocuments.map(normalizeDocument);
};

export default createMany;
