const { buildSchema } = require("graphql");

module.exports = buildSchema(
  `

schema{
    query: RootQuery
    mutation: RootMutation
}


type RootQuery{
    login(email: String!, password:String!):AuthData!
}

type RootMutation{ 
    createUser(userInput:UserInputData):User!
    createPet(petInput: PetInputData):Pet!
}

type AuthData {
    token:String!
    userId: String!
}

input UserInputData{
    email: String!
    name: String!
    password: String!
}

input PetInputData{
    name:String!
    description: String!
}

type User{
    _id: ID!
    name: String!
    email:String!
    password: String
}

type Pet{
    _id: ID!
    name: String!
    creator: User!
    description: String!
}



`
);
