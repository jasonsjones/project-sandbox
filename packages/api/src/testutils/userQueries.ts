export const RegisterUserOp = `
mutation RegisterUser($userData: RegisterUserInput!) {
    registerUser(userData: $userData) {
        user {
            id
            firstName
            lastName
            displayName
            email
        }
    }
}`;

export const UserQuery = `
query {
    users {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

export const GetUserOp = `
query GetUser($id: String!){
    user(id: $id) {
        id
        firstName
        lastName
        displayName
        email
    }
}`;
