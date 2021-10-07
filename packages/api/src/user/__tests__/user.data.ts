import { v4 } from 'uuid';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entity';

export const oliver: CreateUserDto = {
    firstName: 'Oliver',
    lastName: 'Queen',
    email: 'oliver@qc.com',
    password: 'secretpassword'
};

export const barry: CreateUserDto = {
    firstName: 'Barry',
    lastName: 'Allen',
    email: 'barry@starlabs.com',
    password: 'secretpassword'
};

export const cisco: CreateUserDto = {
    firstName: 'Ciso',
    lastName: 'Ramon',
    email: 'cisco@starlabs.com',
    password: 'secretpassword'
};

export const mockSavedOliver = User.of({
    id: v4(),
    firstName: oliver.firstName,
    lastName: oliver.lastName,
    email: oliver.email,
    password: oliver.password,
    refreshTokenId: 0
});

export const mockSavedBarry = User.of({
    id: v4(),
    firstName: barry.firstName,
    lastName: barry.lastName,
    email: barry.email,
    password: barry.password,
    refreshTokenId: 0
});
