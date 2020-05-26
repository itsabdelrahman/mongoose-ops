import { Model, Document } from 'mongoose';
import { CountOptions } from '../types';

/**
 * Counts the documents matching the provided
 * query in a collection.
 */
const count = (model: Model<Document>) => async (
  options: CountOptions = {},
): Promise<number> => {
  const { query = {} } = options;

  const result = await model.countDocuments(query).exec();

  return result;
};

export default count;
