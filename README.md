<div align="center">
  <h1>mongoose-ops</h1>

  <a href="https://github.com/ar-maged/mongoose-ops/actions">
    <img src="https://github.com/ar-maged/mongoose-ops/workflows/Node.js%20CI/badge.svg" />
  </a>
</div>

## Description

A thin layer on top of [Mongoose](https://mongoosejs.com/) that facilitates [MongoDB](https://www.mongodb.com/) CRUD operations using a straightforward API.

_Disclaimer: this package is experimental — use at your own peril._

## Installation

```bash
❯ npm install --save mongoose-ops
```

## Usage

```js
import {
  count,
  getOne,
  getMany,
  createOne,
  createMany,
  updateOne,
  deleteOne,
  deleteMany,
} from 'mongoose-ops';

/* Count documents */
const usersCount = await count(userModel)();

/* Get document */
const existingUser = await getOne(userModel)({
  query: {
    _id: '507f1f77bcf86cd799439011',
  },
});

/* Get multiple documents */
const existingUsers = await getMany(userModel)({
  query: {
    name: new RegExp('^B[a-z]+'),
  },
  sorting: {
    createdAt: 'DESCENDING',
  },
  pagination: {
    skip: 0,
    limit: 10,
  },
});

/* Create document */
const createdUser = await createOne(userModel)({
  document: {
    name: 'John',
  },
});

/* Create multiple documents */
const createdUsers = await createMany(userModel)({
  documents: [
    {
      name: 'John',
    },
    {
      name: 'Jane',
    },
  ],
});

/* Update document */
const updatedUser = await updateOne(userModel)({
  query: {
    _id: '507f1f77bcf86cd799439011',
  },
  document: {
    name: 'Elizabeth',
  },
});

/* Delete document */
const deletedUser = await deleteOne(userModel)({
  query: {
    _id: '507f1f77bcf86cd799439011',
  },
});

/* Delete multiple documents */
const deletedUsers = await deleteMany(userModel)({
  query: {
    name: new RegExp('^B[a-z]+'),
  },
});
```

## License

[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
