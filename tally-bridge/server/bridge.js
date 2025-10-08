import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes.js'; // or .ts if using TS
import { addLog } from '../logger.js';

export function startBridgeServer(port = 4000) {
    const app = express();

    // ✅ Enable CORS properly for all routes/methods
    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
    }));

    // ✅ Optional: Log all incoming requests
    app.use((req, res, next) => {
        console.log(`🛰️  ${req.method} ${req.url}`);
        next();
    });

    // ✅ Handle XML bodies specifically for Tally endpoints
    app.use(bodyParser.text({ type: 'application/xml' }));
    
    // ✅ Handle JSON bodies for potential JSON endpoints
    app.use(express.json());

    // ✅ Mount your actual route handlers
    app.use('/', routes);

    // ✅ Start server
    app.listen(port, () => {
        console.log(`🚀 Tally Bridge server running on http://localhost:${port}`);
        addLog(`Tally Bridge server running on http://localhost:${port}`);
    });
}
