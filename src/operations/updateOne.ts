import { Model, Document } from 'mongoose';
import { flatten } from 'flat';
import { normalizeDocument } from '../utilities';

type UpdateOneOptions<T> = {
  query: Query;
  document: T;
};

type Query = any;

/**
 * Modifies a document matching the provided
 * query in a collection.
 */
const updateOne = <T>(model: Model<Document>) => async (
  options: UpdateOneOptions<T>,
): Promise<T> => {
  const { query, document } = options;

  const flattenedDocument = flatten(document);

  const configuration = {
    new: true,
    omitUndefined: true,
  };

  const updatedDocument = await model.findOneAndUpdate(
    query,
    flattenedDocument,
    configuration,
  );

  return updatedDocument ? normalizeDocument(updatedDocument) : null;
};

export default updateOne;
