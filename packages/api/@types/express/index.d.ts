import User from '../../src/user/user.entity';

declare global {
    namespace Express {
        interface User {
            id: string;
        }
    }
}
