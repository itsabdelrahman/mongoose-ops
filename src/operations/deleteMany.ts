import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';

type DeleteManyOptions = {
  query: Query;
};

type Query = any;

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
