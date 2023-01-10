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
    updatePet(id:String, petInput: PetUpdateData): Pet!
    updateUser(userInput:UserUpdateData):User!
}

input UserUpdateData{
    firstName: String!
    lastName:String!
    email:String!
    street: String!
    zip: String!
    tel:String!
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
    street: String!
    city: String!
    zip: String!
    tel:String!
}

input PetUpdateData{
    name: String
    description: String
    image: String
}

input PetInputData{
    name:String!
    type:String!
    phone:String!
    image: String!
    description: String!
}

type User{
    _id: ID!
    firstName: String!
    lastName:String!
    email:String!
    password: String
    street: String!
    city: String!
    zip: String!
    tel: String!
    pets: [Pet]
}

type Pet{
    _id: ID!
    name: String!
    type: String!
    image: String!
    breed: String
    creator: User!
    description: String
    isLost: Boolean

}



`
);
