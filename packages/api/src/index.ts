import createApp from './config/app';

const PORT = process.env.PORT || 3001;

async function start() {
    const app = await createApp();

    app.listen(PORT, () => {
        console.log(`Express server started at localhost:${PORT}`);
    });
}

start();
