/**
 * @author: Jam Furaque
 */
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer } = require('apollo-server-express');
const databaseConnection = require('./config/db');
const typeDefs = require('./typeDefs/combineDefs');
const resolvers = require('./resolvers/combineResolver');
const cors = require('cors');                                   // I INSTALLED CORS CUZ MAN, GRAPHQL WONT WORK ON MY BROWSER
require('dotenv').config();                                     // FORGOT THAT I COULD JUST USE POSTMAN LOL

const app = express();
app.use(cors());

app.use(graphqlUploadExpress({ maxFileSize: 5 * 1024 * 1024, maxFiles: 1 }));

databaseConnection();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

server.start().then(() => {
    server.applyMiddleware({ app });
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
}).catch((error) => {
    console.log('Server failed to start:', error);
});
