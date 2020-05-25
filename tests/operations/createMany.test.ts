import { Model, Document } from 'mongoose';
import { createMany } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../mongodb';

describe('MongoDB: createMany()', () => {
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

  test('should create documents', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
      },
      {
        name: 'Jane',
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    const createdStudents = await createMany(model)({ documents: newStudents });

    expect(createdStudents).toHaveLength(2);
    expect(createdStudents[0]).toMatchObject({
      _id: expect.any(String),
      ...newStudents[0],
    });
  });

  test('should not return metadata', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
      },
      {
        name: 'Jane',
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    const createdStudents = await createMany(model)({
      documents: newStudents,
    });

    expect((<any>createdStudents[0]).__v).toBeUndefined();
  });
});
