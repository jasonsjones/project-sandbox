import getApp from './config/app';

const PORT = process.env.PORT || 3000;

async function start() {
    const app = await getApp();

    app.listen(PORT, () => {
        console.log(`Express server started at localhost:${PORT}`);
    });
}

start();
