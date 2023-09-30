import express from 'express';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5002;

// Importing global error handling middleware
import globalErrorHandler from './../shared/middlewares/error.handling';

// Importing routes
// User routes
import userRoutes from '../modules/user/user.routes';

// Public middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Mount routes
app.use("/api/v1/users", userRoutes);

// Mount global error handling middleware
app.use(globalErrorHandler);


const server = app.listen(() =>  {
  console.log(`Server is running on ${port}`);
});

// Handle unhandled rejection errors
process.on('unhandledRejection', (error: Error) => {
  console.error(`Unhandled Rejection Error >>> ${error.name} >>> ${error.message}`)
  server.close(() => {
    console.error('Shutting down ... ')
    process.exit(1);
  })
});