export type CountOptions = {
  query?: Query;
};

export type GetOneOptions = {
  query?: Query;
};

export type GetManyOptions = {
  query?: Query;
  sorting?: Sorting;
  pagination?: Pagination;
};

export type CreateOneOptions<T> = {
  document: T;
};

export type CreateManyOptions<T> = {
  documents: T[];
};

export type UpdateOneOptions<T> = {
  query: Query;
  document: T;
};

export type DeleteOneOptions = {
  query: Query;
};

export type DeleteManyOptions = {
  query: Query;
};

export type Sorting = {
  [key: string]: SortingOrder;
};

export type Pagination = {
  skip: number;
  limit: number;
};

export type SortingOrder = 'ASCENDING' | 'DESCENDING';

export type Query = any;
