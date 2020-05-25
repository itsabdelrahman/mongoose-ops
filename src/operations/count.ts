import { Model, Document } from 'mongoose';

type CountOptions = {
  query?: Query;
};

type Query = any;

const count = (model: Model<Document>) => async (
  options: CountOptions = {},
): Promise<number> => {
  const { query = {} } = options;

  const result = await model.countDocuments(query).exec();

  return result;
};

export default count;
