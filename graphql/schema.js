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
    content(id:String!):PetContent
    getPets:[Pet]
    lookupPet(id:String!):Pet!
}

type RootMutation{ 
    createUser(userInput:UserInputData):User!
    createPet(petInput: PetInputData):Pet!
    updatePet(id:String, petInput: PetUpdateData): Pet!
    updateUser(userInput:UserUpdateData):User!
    deleteUser(id:String!): Boolean
    deletePet(petId:String!): Boolean
    updatePetContent(id:String!, content: PetContentInputData): PetContent
    deleteContent(petId:String!, contentId:String!):Boolean

}

input PetContentInputData{
    type:String!
    bullets: [String]!
}


type PetContent{
    _id: ID!
    type: String!
    bullets: [String]!
    parent: Pet!
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
    gender: String
    birth: String
    type:String
    breed:String
}

input PetInputData{
    name:String!
    type:String!
    phone:String!
    image: String!
    breed: String!
    gender: String!
    description: String!
    birth: String!

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
    gender: String
    owner: User!
    birth: String
    description: String
    isLost: Boolean
    content: [PetContent]

}



`
);
