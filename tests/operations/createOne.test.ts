import { Model, Document } from 'mongoose';
import { createOne } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../mongodb';

describe('MongoDB: createOne()', () => {
  let model: Model<Document>;
  let database: Database;
  let databaseServer: DatabaseServer;

  beforeAll(async () => {
    const [
      testingModel,
      testingDatabase,
      testingDatabaseServer,
    ] = await beforeAllHook();

    model = testingModel;
    database = testingDatabase;
    databaseServer = testingDatabaseServer;
  });

  afterAll(async () => {
    await afterAllHook(database, databaseServer);
  });

  beforeEach(async () => {
    await beforeEachHook(database);
  });

  test('should create a document', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    const createdStudent = await createOne(model)({ document: newStudent });

    expect(createdStudent).toMatchObject({
      _id: expect.any(String),
      ...newStudent,
    });
  });

  test('should not return metadata', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    const createdStudent = await createOne(model)({
      document: newStudent,
    });

    expect((<any>createdStudent).__v).toBeUndefined();
  });
});
