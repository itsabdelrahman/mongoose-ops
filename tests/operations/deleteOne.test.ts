import { Model, Document } from 'mongoose';
import { deleteOne } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../types';

describe('MongoDB: deleteOne()', () => {
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

  test('should delete identified document', async () => {
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

    const createdStudents = await model.create(newStudents);

    const deletedStudent = await deleteOne(model)({
      query: {
        _id: createdStudents[1]._id.toString(),
      },
    });

    expect(deletedStudent).toMatchObject({
      _id: createdStudents[1]._id.toString(),
    });
  });

  test('should delete selected document', async () => {
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

    const deletedStudent = await deleteOne(model)({
      query: {
        name: 'Jane',
      },
    });

    expect(deletedStudent).toMatchObject({
      _id: expect.any(String),
      name: 'Jane',
    });
  });

  test('should delete nestedly selected document', async () => {
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

    const deletedStudent = await deleteOne(model)({
      query: {
        'social.facebook': 'fb.com/jane',
      },
    });

    expect(deletedStudent).toMatchObject({
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

    const deletedStudent = await deleteOne(model)({
      query: {
        name: 'John',
      },
    });

    expect((<any>deletedStudent).__v).toBeUndefined();
  });

  test('should not break if query has no matches', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const deleteOneOperation = deleteOne(model)({
      query: {
        name: 'Robin',
      },
    });

    await expect(deleteOneOperation).resolves.toBeNull();
  });
});
