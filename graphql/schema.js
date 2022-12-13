const { buildSchema } = require("graphql");

module.exports = buildSchema(
  `

schema{
    query: RootQuery
    mutation: RootMutation
}


type RootQuery{
    login(email: String!, password:String!):AuthData!
    user:User!
    pet(id: String!):Pet!
    getPets:[Pet]
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
    firstName: String!
    lastName:String!
    email:String!
    password: String!
}

input PetInputData{
    name:String!
    type:String!
    phone:String!
}

type User{
    _id: ID!
    firstName: String!
    lastName:String!
    email:String!
    password: String
    pets: [Pet]
}

type Pet{
    _id: ID!
    name: String!
    type: String!
    breed: String
    creator: User!
    description: String
    isLost: Boolean

}



`
);
