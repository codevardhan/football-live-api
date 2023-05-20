//https://dev-8634341.okta.com/oauth2/default
const express = require('express');
const graphqlHTTP = require('express-graphql');
//const schema = require("./schema");
const scraper = require("./scraper");
const { buildSchema } = require("graphql");
const { data } = require('cheerio/lib/api/attributes');

var schema = buildSchema(`
  type Query {
    getMatchesLeague(country: String!, comp: String!): [MatchInstance]
  }

  type MatchInstance {
    status: String
    time: String
    team_1: String
    team_2: String
    score_1: String
    score_2: String
    fh_score: String
  } 
`);

const resolvers = {
    getMatchesLeague: ({ country, comp }) => {
        return scraper.getDataFromCompName(country, comp)
    }
};

const app = express();
app.use(
    "/score-fetch",
    graphqlHTTP.graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: true,
    })
);
app.listen(8000);

console.log(`🚀 Server ready at http://localhost:3000/score-fetch`);