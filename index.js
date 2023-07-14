const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const resolver = require('./resolvers');
const blob = require('./blob');
const morgan = require('morgan');
require("dotenv").config();
const basicAuth = require('express-basic-auth');
const uploadRoutes = require('./routes/upload');

blob.init();

const app = express();
app.use(morgan('tiny'));

if (process.env.BASIC_USER && process.env.BASIC_PW) {
  const user = process.env.BASIC_USER;
  const pw = process.env.BASIC_PW;
  app.use(basicAuth({
    challenge: true,
    users: {
      [user]: pw,
    }
  }));
}

app.use(bodyParser.json());
const typeDefs = `#graphql
  type Circurit {
    _id: String
    name: String
    description: String
    hasImage: Boolean
    imageUrl: String
    componentIds: [String]
    components: [Component]
  }

  enum ComponentType {
    ic
    bjt_transistor
    mosfet
    diode
    module
    mcu
    special
  }

  input ComponentInput {
    name: String
    type: ComponentType
    componentIds: [String]
  }

  input CircuritInput {
    name: String
    description: String
    componentIds: [String]
  }

  type Component {
    _id: String
    name: String
    type: ComponentType
    datasheetUrl: String
    componentIds: [String]
    circurits: [Circurit]
  }

  enum SortOrder {
    asc
    desc
  }

  input SortInput {
    field: String
    dir: SortOrder
  }

  type Query {
    circurits(sort: SortInput): [Circurit]
    circurit(id: String!): Circurit
    component(id: String!): Component
    components(sort: SortInput): [Component]
    countCircurits: Int
    countComponents: Int
  }

  type Mutation {
    createComponent(component: ComponentInput): Component
    createCircurit(circurit: CircuritInput): Circurit
    updateComponent(_id: String, component: ComponentInput!): Component
    updateCircurit(_id: String, circurit: CircuritInput!): Circurit
  }
`;

const resolvers = {
  Query: {
    ...resolver.circurits.Query,
    ...resolver.components.Query,
  },
  Circurit: resolver.circurits.Circurit,
  Component: resolver.components.Component,
  Mutation: {
    ...resolver.components.Mutation,
    ...resolver.circurits.Mutation,
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const start = async () => {
  await db.connect();

  await server.start();
  app.use('/graphql', expressMiddleware(server));
  app.use('/static', express.static('static'));

  app.get('/uploadUrl/:type/:id', uploadRoutes.uploadUrl);
  app.get('/finalizeUrl/:type/:id', uploadRoutes.finalizeUrl);

  app.listen(process.env.PORT || 4000)
}

start();
