import { Mongoose } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export type Database = Mongoose;

export type DatabaseServer = MongoMemoryServer;
