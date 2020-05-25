import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';

type CreateManyOptions<T> = {
  documents: T[];
};

const createMany = <T>(model: Model<Document>) => async (
  options: CreateManyOptions<T>,
): Promise<T[]> => {
  const { documents } = options;

  const createdDocuments = await model.insertMany(documents);

  return createdDocuments.map(normalizeDocument);
};

export default createMany;
