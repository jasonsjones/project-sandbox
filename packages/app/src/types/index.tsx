export interface User {
    id: string;
    displayName: string;
    email: string;
    firstName: string;
    lastName: string;
}

export type ContextUserInfo = Pick<User, 'id' | 'displayName' | 'firstName' | 'lastName'>;

export interface LoginResponseData {
    accessToken: string;
    userInfo?: ContextUserInfo;
}

export enum UserListView {
    LIST = 'list',
    CARDS = 'cards'
}
