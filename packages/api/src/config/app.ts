import express, { Request, Response } from 'express';

function configureApp() {
    const app = express();

    app.get(
        '/api',
        (_: Request, res: Response): Response => {
            return res.json({
                success: true,
                message: 'side project api'
            });
        }
    );

    return app;
}

export default configureApp();
