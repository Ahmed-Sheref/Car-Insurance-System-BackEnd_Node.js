import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Project2026 API",
      version: "1.0.0",
      description: "API Documentation for Login, Policy, Accident modules",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local" }
    ],
    components: {
      securitySchemes: {
        basicAuth: { type: "http", scheme: "basic" },
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
    }
  },
  // لو هتكتب docs بالـ JSDoc داخل ملفاتك:
  apis: ["D:\\Programming\\Back_end\\MyProject\\index.js"
        , "D:\\Programming\\Back_end\\MyProject\\Routes\\AccidentRoute.js",
        "D:\\Programming\\Back_end\\MyProject\\Routes\\PolicyRoute.js"],
});
