import swaggerJsdoc from "swagger-jsdoc";
import userAccountSchema from "./specs/user-account";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mocafi account API",
      version: "1.0.0",
      description:
        "Mocafi REST API documentation. This API is used to manage mocafi accounts.",
    },
    servers: [
      {
        url: process.env.APP_URL ?? "http://localhost:3000",
      },
    ],
    consumes: ["application/json"],
    components: {
      schemas: { ...userAccountSchema },
    },
    tags: [
      {
        name: "Users",
        description: "User management",
      },
      {
        name: "Parties",
        description: "Party management",
      },
    ],
  },
  apis: ["./src/app/rest/routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export default specs;
