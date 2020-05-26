import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';

type DeleteOneOptions = {
  query: Query;
};

type Query = any;

/**
 * Deletes a document matching the provided query
 * in a collection.
 */
const deleteOne = <T>(model: Model<Document>) => async (
  options: DeleteOneOptions,
): Promise<T> => {
  const { query } = options;

  const deletedDocument = await model.findOneAndDelete(query);

  return deletedDocument ? normalizeDocument(deletedDocument) : null;
};

export default deleteOne;
