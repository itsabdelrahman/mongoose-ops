import { Model, Document } from 'mongoose';
import { normalizeDocument } from '../utilities';

type GetManyOptions = {
  query?: Query;
  sorting?: Sorting;
  pagination?: Pagination;
};

type Query = any;

type Sorting = {
  [key: string]: SortingOrder;
};

type Pagination = {
  skip: number;
  limit: number;
};

type SortingOrder = 'ASCENDING' | 'DESCENDING';

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
