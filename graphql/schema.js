const { buildSchema } = require("graphql");

module.exports = buildSchema(
`
schema{
    query: RootQuery
    mutation: RootMutation
}

type RootMutation{
    createUser():User!
}


type User{
    _id: ID!
    name: String!
    email:String!
    password: String
    
}

`
)