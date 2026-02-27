import swaggerJsDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Car Insurance System API",
      version: "1.0.0",
      description: "Comprehensive API documentation for Car Insurance Management System including authentication, policies, accidents, and admin operations",
      contact: {
        name: "Ahmed Sheref",
        email: "ahmed@example.com"
      }
    },
    servers: [
      { 
        url: "http://localhost:3000", 
        description: "Development Server" 
      },
      { 
        url: "https://your-production-url.com", 
        description: "Production Server" 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { 
          type: "http", 
          scheme: "bearer", 
          bearerFormat: "JWT",
          description: "JWT token obtained from login"
        },
        basicAuth: { 
          type: "http", 
          scheme: "basic" 
        }
      },
      schemas: {
        User: {
          type: "object",
          required: ["customer_name", "customer_email", "customer_password"],
          properties: {
            customer_id: {
              type: "integer",
              description: "Auto-generated user ID"
            },
            customer_name: {
              type: "string",
              example: "Ahmed Mohamed"
            },
            customer_email: {
              type: "string",
              format: "email",
              example: "ahmed@example.com"
            },
            customer_password: {
              type: "string",
              format: "password",
              example: "password123"
            },
            customer_type: {
              type: "string",
              enum: ["Regular", "Individual", "admin"],
              example: "Regular"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["customer_email", "customer_password"],
          properties: {
            customer_email: {
              type: "string",
              format: "email",
              example: "ahmed@example.com"
            },
            customer_password: {
              type: "string",
              example: "password123"
            }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            user: {
              $ref: "#/components/schemas/User"
            }
          }
        },
        Car: {
          type: "object",
          properties: {
            car_id: {
              type: "integer",
              description: "Auto-generated car ID"
            },
            vin: {
              type: "string",
              description: "Vehicle Identification Number",
              example: "1HGCM82633A004352"
            },
            make: {
              type: "string",
              example: "Toyota"
            },
            model: {
              type: "string",
              example: "Camry"
            },
            year: {
              type: "integer",
              example: 2022
            },
            customer_id: {
              type: "integer",
              description: "Owner's customer ID"
            }
          }
        },
        Accident: {
          type: "object",
          required: ["acc_description", "location", "accident_date", "car_id", "customer_id"],
          properties: {
            accident_id: {
              type: "integer",
              description: "Auto-generated accident ID"
            },
            acc_description: {
              type: "string",
              example: "Rear collision at traffic light"
            },
            location: {
              type: "string",
              example: "Nasr City, Cairo"
            },
            accident_date: {
              type: "string",
              format: "date",
              example: "2026-01-20"
            },
            car_id: {
              type: "integer",
              example: 12
            },
            customer_id: {
              type: "integer",
              example: 5
            },
            acc_image: {
              type: "string",
              format: "binary",
              description: "Accident image file"
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            }
          }
        },
        PolicyRequest: {
          type: "object",
          required: ["policy_type", "coverage_amount", "car_id"],
          properties: {
            req_id: {
              type: "integer",
              description: "Auto-generated request ID"
            },
            policy_type: {
              type: "string",
              enum: ["comprehensive", "third_party", "collision"],
              example: "comprehensive"
            },
            coverage_amount: {
              type: "number",
              example: 50000
            },
            car_id: {
              type: "integer",
              example: 12
            },
            customer_id: {
              type: "integer",
              example: 5
            },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected"],
              example: "pending"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2026-01-20T10:30:00Z"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error message description"
            },
            error: {
              type: "string",
              example: "Detailed error information"
            }
          }
        },
        Success: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation completed successfully"
            },
            data: {
              type: "object"
            }
          }
        }
      }
    },
    paths: {
      "/api/v1/auth/signUp": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          description: "Create a new customer account in the system",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          responses: {
            201: {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Success" }
                }
              }
            },
            400: {
              description: "Invalid input data",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            409: {
              description: "Email already exists",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/v1/auth/logIn": {
        post: {
          tags: ["Authentication"],
          summary: "User login",
          description: "Authenticate user and return JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" }
              }
            }
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" }
                }
              }
            },
            401: {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/v1/auth/admin/login": {
        post: {
          tags: ["Authentication"],
          summary: "Admin login",
          description: "Authenticate admin user and return JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" }
              }
            }
          },
          responses: {
            200: {
              description: "Admin login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" }
                }
              }
            },
            401: {
              description: "Invalid admin credentials",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/v1/auth/google": {
        get: {
          tags: ["Authentication"],
          summary: "Google OAuth login",
          description: "Redirect to Google for authentication",
          responses: {
            302: {
              description: "Redirect to Google OAuth"
            }
          }
        }
      },
      "/api/v1/auth/google/callback": {
        get: {
          tags: ["Authentication"],
          summary: "Google OAuth callback",
          description: "Handle Google OAuth callback and issue JWT",
          responses: {
            302: {
              description: "Redirect to frontend with token"
            },
            401: {
              description: "OAuth authentication failed"
            }
          }
        }
      },
      "/api/v1/customer/me": {
        get: {
          tags: ["Customer"],
          summary: "Get current user profile",
          description: "Retrieve the profile of the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "User profile retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            },
            401: {
              description: "Unauthorized - Invalid or missing token"
            }
          }
        }
      },
      "/api/v1/customer/car": {
        get: {
          tags: ["Customer", "Cars"],
          summary: "Get user's cars",
          description: "Retrieve all cars belonging to the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Cars retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Cars fetched successfully" },
                      data: {
                        type: "object",
                        properties: {
                          cars: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Car" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized"
            }
          }
        },
        post: {
          tags: ["Customer", "Cars"],
          summary: "Add a new car using VIN",
          description: "Register a new car using VIN number (data fetched from external API)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["vin"],
                  properties: {
                    vin: { 
                      type: "string", 
                      minLength: 11,
                      description: "Vehicle Identification Number (11-17 characters)",
                      example: "1HGCM82633A004352" 
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Car added successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Car added successfully" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Car" }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Invalid VIN or external API error"
            },
            401: {
              description: "Unauthorized"
            },
            500: {
              description: "Server error"
            }
          }
        }
      },
      "/api/v1/customer/car/{car_id}": {
        patch: {
          tags: ["Customer", "Cars"],
          summary: "Update car information",
          description: "Update details of a specific car belonging to the user",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "car_id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Car ID to update"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["model", "year", "make"],
                  properties: {
                    model: { type: "string", example: "Honda Civic" },
                    year: { type: "integer", example: 2023 },
                    make: { type: "string", example: "Honda" }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Car updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Car updated successfully" },
                      data: {
                        type: "object",
                        properties: {
                          car: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Car" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Car not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        },
        delete: {
          tags: ["Customer", "Cars"],
          summary: "Delete a car",
          description: "Remove a car from the user's profile",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "car_id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Car ID to delete"
            }
          ],
          responses: {
            200: {
              description: "Car deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string", example: "success" },
                      message: { type: "string", example: "Car deleted successfully" },
                      data: {
                        type: "object",
                        properties: {
                          car: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Car" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: "Car not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/policy/policy-requests": {
        get: {
          tags: ["Policy"],
          summary: "Get user's policy requests",
          description: "Retrieve all policy requests made by the authenticated user",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Policy requests retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/PolicyRequest" }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized"
            }
          }
        },
        post: {
          tags: ["Policy"],
          summary: "Create new policy request",
          description: "Submit a new insurance policy request",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["policy_type", "coverage_amount", "car_id"],
                  properties: {
                    policy_type: {
                      type: "string",
                      enum: ["comprehensive", "third_party", "collision"],
                      example: "comprehensive"
                    },
                    coverage_amount: {
                      type: "number",
                      example: 50000
                    },
                    car_id: {
                      type: "integer",
                      example: 12
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Policy request created successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PolicyRequest" }
                }
              }
            },
            400: {
              description: "Invalid policy request data"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/policy/policy-requests/{req_id}": {
        get: {
          tags: ["Policy"],
          summary: "Get specific policy request",
          description: "Retrieve details of a specific policy request",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "req_id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Policy request ID"
            }
          ],
          responses: {
            200: {
              description: "Policy request retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/PolicyRequest" }
                }
              }
            },
            404: {
              description: "Policy request not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/accident": {
        post: {
          tags: ["Accident"],
          summary: "Report an accident",
          description: "Create a new accident report with image upload",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["acc_description", "location", "accident_date", "car_id", "customer_id", "acc_image"],
                  properties: {
                    acc_description: {
                      type: "string",
                      example: "Rear collision at traffic light"
                    },
                    location: {
                      type: "string",
                      example: "Nasr City, Cairo"
                    },
                    accident_date: {
                      type: "string",
                      format: "date",
                      example: "2026-01-20"
                    },
                    car_id: {
                      type: "integer",
                      example: 12
                    },
                    customer_id: {
                      type: "integer",
                      example: 5
                    },
                    acc_image: {
                      type: "string",
                      format: "binary"
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Accident reported successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Accident" }
                }
              }
            },
            400: {
              description: "Invalid accident data or file"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/admin/customers": {
        get: {
          tags: ["Admin"],
          summary: "Get all customers",
          description: "Retrieve all customers in the system (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Customers retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized or insufficient permissions"
            }
          }
        }
      },
      "/api/v1/admin/customers/{id}": {
        get: {
          tags: ["Admin"],
          summary: "Get customer by ID",
          description: "Retrieve specific customer details (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Customer ID"
            }
          ],
          responses: {
            200: {
              description: "Customer retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            },
            404: {
              description: "Customer not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/admin/accidents": {
        get: {
          tags: ["Admin"],
          summary: "Get all accidents",
          description: "Retrieve all accident reports (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Accidents retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Accident" }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/admin/accidents/{id}": {
        get: {
          tags: ["Admin"],
          summary: "Get accident by ID",
          description: "Retrieve specific accident details (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Accident ID"
            }
          ],
          responses: {
            200: {
              description: "Accident retrieved successfully",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Accident" }
                }
              }
            },
            404: {
              description: "Accident not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        },
        patch: {
          tags: ["Admin"],
          summary: "Update accident status",
          description: "Update the status of an accident (Admin only)",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "Accident ID"
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: {
                      type: "string",
                      enum: ["pending", "approved", "rejected"],
                      example: "approved"
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Accident status updated successfully"
            },
            404: {
              description: "Accident not found"
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/admin/payments": {
        get: {
          tags: ["Admin"],
          summary: "Get all payments",
          description: "Retrieve all payment records (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Payments retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        payment_id: { type: "integer" },
                        amount: { type: "number" },
                        payment_date: { type: "string", format: "date-time" },
                        status: { type: "string" },
                        customer_id: { type: "integer" }
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      },
      "/api/v1/admin/policies": {
        get: {
          tags: ["Admin"],
          summary: "Get all policies",
          description: "Retrieve all insurance policies (Admin only)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Policies retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/PolicyRequest" }
                  }
                }
              }
            },
            401: {
              description: "Unauthorized"
            }
          }
        }
      }
    }
  },
  apis: [] // Empty since we're defining everything externally
});
