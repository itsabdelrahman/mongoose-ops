import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';

type DeleteManyOptions = {
  query: Query;
};

type Query = any;

const deleteMany = <T>(model: Model<Document>) => async (
  options: DeleteManyOptions,
): Promise<T[]> => {
  const { query } = options;

  const fetchedDocuments = await model.find(query);

  await model.deleteMany(query);

  return fetchedDocuments.map(normalizeDocument);
};

export default deleteMany;
