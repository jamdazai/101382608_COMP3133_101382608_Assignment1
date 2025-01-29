/**
 * @author: Jam Furaque
 */
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const databaseConnection = require('./config/db');
const typeDefs = require('./typeDefs/combineDefs');
const resolvers = require('./resolvers/combineResolver');
const cors = require('cors');                                   // I INSTALLED CORS CUZ MAN, GRAPHQL WONT WORK ON MY BROWSER
require('dotenv').config();                                     // FORGOT THAT I COULD JUST USE POSTMAN LOL


const app = express();
app.use(cors());
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true,
}));
databaseConnection();                                           // DATABASE CONNECTION

const server = new ApolloServer({ typeDefs, resolvers, 
    context: ({ req }) => ({ req }),
    formatError: (err) => {
        return {
            message: err.message,
            status: err.status || 500,
            path: err.path,
            extensions: err.extensions,
        };
    },
});

server.start().then(() => {
    server.applyMiddleware({ app });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log('Server failed to start');
});

