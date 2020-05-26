import { Model, Document } from 'mongoose';
import { deleteMany } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../types';

describe('MongoDB: deleteMany()', () => {
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

  test('should delete selected documents', async () => {
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

    await model.create(newStudents);

    const deletedStudents = await deleteMany(model)({
      query: {
        name: 'Jane',
      },
    });

    expect(deletedStudents).toHaveLength(1);
    expect(deletedStudents[0]).toMatchObject({
      _id: expect.any(String),
      name: 'Jane',
    });
  });

  test('should delete nestedly selected documents', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
        social: {
          facebook: 'fb.com/john',
          twitter: 'tw.com/john',
        },
      },
      {
        name: 'Jane',
        social: {
          facebook: 'fb.com/jane',
          twitter: 'tw.com/jane',
        },
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    await model.create(newStudents);

    const deletedStudents = await deleteMany(model)({
      query: {
        'social.facebook': 'fb.com/jane',
      },
    });

    expect(deletedStudents).toHaveLength(1);
    expect(deletedStudents[0]).toMatchObject({
      _id: expect.any(String),
      name: 'Jane',
    });
  });

  test('should not return metadata', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const deletedStudents = await deleteMany(model)({
      query: {
        name: 'John',
      },
    });

    expect((<any>deletedStudents[0]).__v).toBeUndefined();
  });

  test('should not break if query has no matches', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const deleteOneOperation = deleteMany(model)({
      query: {
        name: 'Robin',
      },
    });

    await expect(deleteOneOperation).resolves.toEqual([]);
  });
});
