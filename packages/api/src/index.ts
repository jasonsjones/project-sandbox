export function start(message: string): string {
    const output = `[env: ${process.env.NODE_ENV}] ${message}`;
    return output;
}

if (process.env.NODE_ENV !== 'testing') {
    console.log(start('Starting the API...'));
}
