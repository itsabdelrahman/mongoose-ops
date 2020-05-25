import { model, Model, Schema, Document } from 'mongoose';
import {
  startTestingMongoDBConnection,
  closeTestingMongoDBConnection,
  dropMongoDBDatabase,
  Database,
  DatabaseServer,
} from './mongodb';

export const beforeAllHook = async (): Promise<
  [Model<Document>, Database, DatabaseServer]
> => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

  const [database, databaseServer] = await startTestingMongoDBConnection();
  await dropMongoDBDatabase(database);

  const model = createDummyStudentModel();

  return [model, database, databaseServer];
};

export const afterAllHook = async (
  database: Database,
  databaseServer: DatabaseServer,
): Promise<void> => {
  await closeTestingMongoDBConnection(database, databaseServer);
};

export const beforeEachHook = async (database: Database): Promise<void> => {
  await dropMongoDBDatabase(database);
};

const createDummyStudentModel = (): Model<Document> => {
  const studentSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    social: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
    },
    createdAt: {
      type: Number,
      required: true,
    },
  });

  const studentModel = model('Student', studentSchema, 'students');

  return studentModel;
};
