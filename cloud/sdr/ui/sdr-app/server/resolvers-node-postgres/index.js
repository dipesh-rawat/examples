/*eslint-env node*/
const psql = require('./adapter').psql;
// console.log('in resolver-node-postgres/index.js');

// should match type Query in schema.js, one function per endpoint
exports.resolvers = {
    Query: {
        // globalnouns() {  // <- also works
        globalnouns: (obj, args) => {
            // Graphql will automatically wait for this promise to be fulfilled:
            // https://graphql.org/learn/execution/#asynchronous-resolvers - "During execution, GraphQL will wait for Promises, Futures, and Tasks to complete before continuing and will do so with optimal concurrency."
            return psql.query(`select noun, sentiment, numberofmentions, timeupdated from globalnouns order by numberofmentions desc, timeupdated desc limit ${args.limit}`)
                    .then((res) => res.rows);
            // return [{ noun: 'wedding', sentiment: 'positive', numberofmentions: 10 }];
        },
        nodenouns: (obj, args) => {
            return psql.query(`select noun, sentiment, numberofmentions, timeupdated from nodenouns where edgenode = '${args.edgenode}' order by numberofmentions desc, timeupdated desc limit ${args.limit}`)
                    .then((res) => res.rows);
        },
        edgenodes: (obj, args) => {
            return psql.query('select edgenode, latitude, longitude, timeupdated from edgenodes')
                    .then((res) => res.rows);
        },
        edgenodetopnoun: (obj, args) => {
            return psql.query(`select noun, sentiment, numberofmentions, timeupdated from nodenouns where edgenode = '${args.edgenode}' order by numberofmentions desc, timeupdated desc limit 1`)
                    .then((res) => res.rows[0]);
        },
    },
    Mutation: {
        testAddNoun: (obj, args) => {
            return psql.query(`insert into nodenouns (edgenode, noun, sentiment, numberofmentions, timeupdated) values ('orgid/iddqd', 'access', -0.708717, 1, '2018-10-11T12:56:43.000Z')`)
                    .then((res) => res.rows[0])
        }
    },
};
