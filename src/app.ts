import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './config/database';
import router from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log('Database Connected!!');
  })
  .catch((error: any) => {
    console.error('Error during Database connection:', error);
  });

const app = express();
app.use(express.json());

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
