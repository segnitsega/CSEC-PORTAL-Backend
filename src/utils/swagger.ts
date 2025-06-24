import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";
import "../swagger/index"

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CSEC Portal API",
    version: "1.0.0",
    description: "Backend API for the Computer Science and Engineering Club(CSEC) Portal at ASTU. Handles members authentication, attendance tracking, and admin operations.",
    contact: {
      name: "Segni Tsega",
      email: "segnitsega6@gmail.com"
    }
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server"
    },
    {
      url: "https://csec-portal-backend-1.onrender.com",
      description: "Production server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      // add reusable schemas later
    }
  },
  tags: [
    {
      name: "Members",
      description: "Club members management"
    },
    {
      name: "Divisions",
      description: "Club divisions management"
    },
    {
      name:"Groups",
      description: "Division groups"
    },
    {
      name:"Events",
      description: "Events management"
    },
    {
      name:"Sessions",
      description: "Sessions management"
    },
    {
      name:"Rules",
      description:"Club rules"
    },
    {
      name:"Resources",
      description: "Learning resources"
    },
    {
      name: "Attendance",
      description: "Attendance tracking"
    },
    {
      name: "Admin",
      description: "Admin dashboard"
    }
  ]
};


const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ["./src/swagger/*.ts"]
};


export const swaggerSpec = swaggerJSDoc(options);


export const swaggerUiOptions: SwaggerUiOptions = {
  customSiteTitle: "CSEC Portal API Documentation",
  customCss: `
    .topbar { display: none }
    .swagger-ui .information-container { background: #f5f7f9; padding: 20px }
  `,
  customfavIcon: "/public/favicon.ico"
};