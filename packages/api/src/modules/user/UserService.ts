import { DataSource } from 'apollo-datasource';
import { v4 } from 'uuid';

interface User {
    id: string;
    email: string;
    password: string;
}

class UserService extends DataSource {
    private users: User[] = [];

    constructor() {
        super();
    }

    createUser(email: string, password: string): User {
        const newUser = {
            id: v4(),
            email,
            password
        };

        this.users = [...this.users, newUser];
        return newUser;
    }

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        return this.users.find((user) => user.id === id);
    }
}

export default UserService;
