import { DataSource } from 'apollo-datasource';
import { v4 } from 'uuid';
import User from './User';

// Temp in-memory user list to hold all created/registered users.
// Moved reference outside of UserService to enable the list to be
// mutated and/or referenced by multiple UserService instances.
let users: User[] = [];

class UserService extends DataSource {
    constructor() {
        super();
    }

    createUser(email: string, password: string): User {
        const newUser = {
            id: v4(),
            email,
            password
        };

        users = [...users, newUser];
        return newUser;
    }

    getAllUsers(): User[] {
        return users;
    }

    getUserById(id: string): User | undefined {
        return users.find((user) => user.id === id);
    }

    removeAllUsers(): void {
        users = [];
    }
}

export default UserService;
