import { Model, Document } from 'mongoose';
import { getMany } from '../../src/operations';
import { beforeAllHook, afterAllHook, beforeEachHook } from '../hooks';
import { Database, DatabaseServer } from '../types';

describe('MongoDB: getMany()', () => {
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

  test('should get all documents', async () => {
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

    const existingStudents = await getMany(model)();

    expect(existingStudents).toHaveLength(2);
    expect(existingStudents[0]).toMatchObject({
      _id: expect.any(String),
    });
  });

  test('should get selected documents', async () => {
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

    const existingStudents = await getMany(model)({
      query: {
        name: 'Jane',
      },
    });

    expect(existingStudents).toHaveLength(1);
    expect(existingStudents[0]).toMatchObject({ name: 'Jane' });
  });

  test('should get nestedly selected documents', async () => {
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

    const existingStudents = await getMany(model)({
      query: {
        'social.facebook': 'fb.com/jane',
      },
    });

    expect(existingStudents).toHaveLength(1);
    expect(existingStudents[0]).toMatchObject({ name: 'Jane' });
  });

  test('should get sorted documents', async () => {
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

    const existingStudents = await getMany(model)({
      sorting: {
        name: 'ASCENDING',
      },
    });

    expect(existingStudents).toHaveLength(2);
    expect(existingStudents[0]).toMatchObject({ name: 'Jane' });
    expect(existingStudents[1]).toMatchObject({ name: 'John' });
  });

  test('should get paginated documents', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
      },
      {
        name: 'Jane',
      },
      {
        name: 'Alice',
      },
      {
        name: 'Bob',
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    await model.create(newStudents);

    const existingStudents = await getMany(model)({
      pagination: {
        skip: 0,
        limit: 2,
      },
    });

    expect(existingStudents).toHaveLength(2);
  });

  test('should get sorted & paginated documents', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
      },
      {
        name: 'Jane',
      },
      {
        name: 'Alice',
      },
      {
        name: 'Bob',
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    await model.create(newStudents);

    const existingStudents = await getMany(model)({
      sorting: {
        createdAt: 'DESCENDING',
      },
      pagination: {
        skip: 2,
        limit: 2,
      },
    });

    expect(existingStudents).toHaveLength(2);
    expect(existingStudents[0]).toMatchObject({ name: 'Jane' });
    expect(existingStudents[1]).toMatchObject({ name: 'John' });
  });

  test('should get selected, sorted & paginated documents', async () => {
    const nowMillis = Date.now();

    const newStudents = [
      {
        name: 'John',
      },
      {
        name: 'Jane',
      },
      {
        name: 'Alice',
      },
      {
        name: 'Bob',
      },
      {
        name: 'Bruce',
      },
    ].map((student, index) => ({
      ...student,
      createdAt: nowMillis + index * 1000,
    }));

    await model.create(newStudents);

    const existingStudents = await getMany(model)({
      query: {
        name: new RegExp('^B[a-z]+'),
      },
      sorting: {
        createdAt: 'DESCENDING',
      },
      pagination: {
        skip: 1,
        limit: 1,
      },
    });

    expect(existingStudents).toHaveLength(1);
    expect(existingStudents[0]).toMatchObject({ name: 'Bob' });
  });

  test('should not return metadata', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const existingStudents = await getMany(model)({
      query: {
        name: 'John',
      },
    });

    expect((<any>existingStudents[0]).__v).toBeUndefined();
  });

  test('should not break if query has no matches', async () => {
    const newStudent = {
      name: 'John',
      createdAt: Date.now(),
    };

    await model.create(newStudent);

    const deleteOneOperation = getMany(model)({
      query: {
        name: 'Robin',
      },
    });

    await expect(deleteOneOperation).resolves.toEqual([]);
  });
});
