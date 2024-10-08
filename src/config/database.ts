import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Broker } from "../entities/Broker";
import dotenv from 'dotenv';
import path from "path";
import { Role } from "../entities/Role";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "broker",
  synchronize: true,
  logging: false,
  entities: [User, Broker, Role],
  // [__dirname + '/../entities/*.ts'],
  // migrations: [__dirname + '/../migrations/*.ts'],
});
