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

    createUser(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ): Promise<User> {
        const newUser = new User();

        newUser.id = v4();
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.email = email;
        newUser.password = password;

        users = [...users, newUser];
        return Promise.resolve(newUser);
    }

    getAllUsers(): Promise<User[]> {
        return Promise.resolve(users);
    }

    getUserById(id: string): Promise<User | undefined> {
        const foundUser = users.find((user) => user.id === id);
        return Promise.resolve(foundUser);
    }

    removeAllUsers(): Promise<void> {
        users = [];
        return Promise.resolve();
    }
}

export default UserService;
