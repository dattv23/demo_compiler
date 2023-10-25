import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan'; // record log request, error in console
import routes from './routes/submission';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

// Connect to the database
mongoose.connect(`mongodb+srv://datvan635:${process.env.MONGO_CLOUD}@code-arena.m5zvedw.mongodb.net/code-arena`, {
      connectTimeoutMS: 10000
})
      .then(() => console.log("Connected to mongoDB."))
      .catch((err) => console.log("Unable to connect."))

/** RULES OF OUR API */
router.use((req, res, next) => {
      // set the CORS policy
      res.header('Access-Control-Allow-Origin', '*');
      // set the CORS headers
      res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
      // set the CORS method headers
      if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET PUT DELETE POST');
            return res.status(200).json({});
      }
      next();
});

/** Routes */
router.use('/', routes);

/** Error handling */
router.use((req, res, next) => {
      const error = new Error('not found');
      return res.status(404).json({
            message: error.message
      });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 8080;

httpServer.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
});

// Add an event handler for server errors
httpServer.on('error', (error: Error) => {
      console.error('Server error:', error);
});