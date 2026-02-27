import express from 'express';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger-config.js";

const app = express();

// Basic middleware
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Swagger test is working!' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
