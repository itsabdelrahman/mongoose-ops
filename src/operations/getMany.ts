import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';
import { GetManyOptions } from '../types';

/**
 * Retrieves the documents matching the provided
 * query in a collection.
 */
const getMany = <T>(model: Model<Document>) => async (
  options: GetManyOptions = {},
): Promise<T[]> => {
  const { query = {}, sorting = {}, pagination = {} } = options;

  const fetchedDocuments = await model.find(query, null, {
    sort: sorting,
    ...pagination,
  });

  return fetchedDocuments.map(normalizeDocument);
};

export default getMany;
