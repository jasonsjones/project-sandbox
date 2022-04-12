export const statusQuery = `
        query {
            status
        }
        `;

export const usersQuery = `
query {
    users {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

export const userQuery = `
query getUserById($id: String!) {
    user(id: $id) {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

export const RegisterUserOp = `
mutation RegisterUser($userData: RegisterUserInput!) {
    registerUser(userData: $userData) {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

export const meQuery = `
query {
    me {
        id
        firstName
        lastName
        displayName
        email
    }
}`;

export const loginOp = `
mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
        accessToken
        userInfo {
            id
            firstName
            lastName
            displayName
        }
    }
}`;

export const logoutOp = `
mutation Logout {
    logout
}`;

export const refreshAccessTokenOp = `
mutation RefreshAccessToken {
    refreshAccessToken {
        accessToken
    }
}
`;

export const avatarUploadOp = `
mutation AvatarUpload ($userId: String!, $image: Upload!) {
    avatarUpload(avatarData: { userId: $userId, image: $image })
}
`;

export const avatarQuery = `
query fetchAvatar($key: String!) {
     avatar (key: $key)
}`;
