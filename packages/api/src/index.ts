import app from './config/app';

const PORT = process.env.PORT || 3000;

function start() {
    app.listen(PORT, () => {
        console.log(`Express server started at localhost:${PORT}`);
    });
}

start();
