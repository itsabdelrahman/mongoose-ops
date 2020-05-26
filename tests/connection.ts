import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { DatabaseServer, Database } from './types';

export const startTestingMongoDBConnection = async (): Promise<
  [Database, DatabaseServer]
> => {
  const mongoMemoryServer = new MongoMemoryServer();
  const mongoConnectionUri = await mongoMemoryServer.getConnectionString();

  const mongooseConnectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  };

  const mongooseDatabase = await mongoose.connect(
    mongoConnectionUri,
    mongooseConnectionOptions,
  );

  return [mongooseDatabase, mongoMemoryServer];
};

export const closeTestingMongoDBConnection = async (
  database: Database,
  databaseServer: DatabaseServer,
): Promise<void> => {
  await database.disconnect();
  await databaseServer.stop();
};

export const dropMongoDBDatabase = (database: Database): Promise<void> => {
  return database.connection.db.dropDatabase();
};
