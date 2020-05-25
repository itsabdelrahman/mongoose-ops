import { Model, Document } from 'mongoose';
import { updateOne } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../mongodb';

describe('MongoDB: updateOne()', () => {
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

  test('should update identified document', async () => {
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

    const updatedStudent = await updateOne(model)({
      query: {
        _id: createdStudents[1]._id.toString(),
      },
      document: {
        name: 'Elizabeth',
        age: undefined,
      },
    });

    expect(updatedStudent).toMatchObject({
      _id: createdStudents[1]._id.toString(),
      name: 'Elizabeth',
    });

    expect((<any>updatedStudent).age).not.toBeNull();
  });

  test('should update selected document', async () => {
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

    const updatedStudent = await updateOne(model)({
      query: {
        name: 'Jane',
      },
      document: {
        name: 'Elizabeth',
        age: undefined,
      },
    });

    expect(updatedStudent).toMatchObject({
      _id: expect.any(String),
      name: 'Elizabeth',
    });

    expect((<any>updatedStudent).age).not.toBeNull();
  });

  test('should update nestedly selected document', async () => {
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

    const updatedStudent = await updateOne(model)({
      query: {
        'social.facebook': 'fb.com/jane',
      },
      document: {
        name: 'Elizabeth',
      },
    });

    expect(updatedStudent).toMatchObject({
      _id: expect.any(String),
      name: 'Elizabeth',
      social: {
        facebook: 'fb.com/jane',
        twitter: 'tw.com/jane',
      },
    });
  });

  test('should update selected nested document', async () => {
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

    const updatedStudent = await updateOne(model)({
      query: {
        name: 'Jane',
      },
      document: {
        social: {
          facebook: 'fb.com/jane_95',
        },
      },
    });

    expect(updatedStudent).toMatchObject({
      _id: expect.any(String),
      name: 'Jane',
      social: {
        facebook: 'fb.com/jane_95',
        twitter: 'tw.com/jane',
      },
    });
  });

  test('should not return metadata', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const updatedStudent = await updateOne(model)({
      query: {
        name: 'John',
      },
      document: {
        name: 'Jane',
      },
    });

    expect((<any>updatedStudent).__v).toBeUndefined();
  });

  test('should not break if query has no matches', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const updateOneOperation = updateOne(model)({
      query: {
        name: 'Robin',
      },
      document: {
        name: 'Elizabeth',
      },
    });

    await expect(updateOneOperation).resolves.toBeNull();
  });
});
