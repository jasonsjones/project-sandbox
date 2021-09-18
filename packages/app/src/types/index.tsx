export interface User {
    id: string;
    displayName: string;
    email: string;
}

export enum UserListView {
    LIST = 'list',
    CARDS = 'cards'
}
