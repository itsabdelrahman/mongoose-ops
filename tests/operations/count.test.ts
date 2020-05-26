import { Model, Document } from 'mongoose';
import { count } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../types';

describe('MongoDB: count()', () => {
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

  test('should count all documents', async () => {
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

    const studentsCount = await count(model)();

    expect(studentsCount).toBe(2);
  });

  test('should count selected documents', async () => {
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

    const studentsCount = await count(model)({
      query: {
        name: 'Jane',
      },
    });

    expect(studentsCount).toBe(1);
  });

  test('should count nestedly selected documents', async () => {
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

    const studentsCount = await count(model)({
      query: {
        'social.facebook': 'fb.com/jane',
      },
    });

    expect(studentsCount).toBe(1);
  });

  test('should not break if query has no matches', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const deleteOneOperation = count(model)({
      query: {
        name: 'Robin',
      },
    });

    await expect(deleteOneOperation).resolves.toEqual(0);
  });
});
