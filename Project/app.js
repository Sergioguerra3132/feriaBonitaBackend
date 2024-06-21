const path = require('path');
const dotenv = require('dotenv');
const createServer = require('./config/server');
const routes = require('./routes');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const compression = require('compression');
const { validateSwaggerAdmin } = require('./middlewares/authMiddleware');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production';
const envPath = path.join(__dirname, `.env.${isProduction ? 'production' : 'development'}`);
dotenv.config({ path: envPath });



const app = createServer();

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Steel Shock Api',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // your route files
};

app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET, // You should store this securely
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  
  console.log("header")
  if (!req.headers.authorization) {
      // If not, try to get the token from a cookie
      const tokenFromCookie = req.cookies.authToken; // assuming you saved the token under "token" key in cookies
      
      // If a token exists in the cookie, set it as the Authorization header
      if (tokenFromCookie) {
          req.headers.authorization = `Bearer ${tokenFromCookie}`;
      }
  }
  next();
});


const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs',validateSwaggerAdmin(), swaggerUi.serve, (req, res) => {
  
  const swaggerSetupOptions = {
     
  };
  res.send(swaggerUi.generateHTML(swaggerSpec, swaggerSetupOptions));
});



// Middleware and routes
app.use(compression());
app.use('/api', routes);
app.use(errorHandlerMiddleware);


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Login.html')); // Make sure to specify the correct relative path to your login.html
});

app.get('/', (req, res) => {
  res.send('');
});
