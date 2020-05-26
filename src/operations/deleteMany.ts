import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';
import { DeleteManyOptions } from '../types';

/**
 * Deletes the documents matching the provided
 * query in a collection.
 */
const deleteMany = <T>(model: Model<Document>) => async (
  options: DeleteManyOptions,
): Promise<T[]> => {
  const { query } = options;

  const fetchedDocuments = await model.find(query);

  await model.deleteMany(query);

  return fetchedDocuments.map(normalizeDocument);
};

export default deleteMany;
