import { start } from '../index';

it('Displays a message', () => {
    expect(start('starting app')).toContain('starting app');
});

it('Displays the environment ', () => {
    expect(start('starting app')).toContain('env: testing');
});
