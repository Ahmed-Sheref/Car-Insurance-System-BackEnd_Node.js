# 📚 Car Insurance System API Documentation

## 🚀 Overview

This document describes the comprehensive Swagger API documentation for the Car Insurance Management System. The documentation is configured externally in `swagger-config.js` without cluttering your source code with inline comments.

## 📋 Features

- **External Configuration**: All Swagger definitions are in a separate file (`swagger-config.js`)
- **Comprehensive Coverage**: Documents all API endpoints including Authentication, Policies, Accidents, and Admin operations
- **Well-Organized**: Properly categorized into logical groups with detailed schemas
- **Security Documentation**: JWT Bearer authentication and Basic Auth support
- **Rich Examples**: Includes request/response examples for all endpoints

## 🔧 How to Use

### 1. Start Your Server
```bash
npm start
# or
node server.js
```

### 2. Access Swagger UI
Open your browser and navigate to:
```
http://localhost:3000/api-docs
```

### 3. Explore the Documentation
- **Interactive Testing**: Try API endpoints directly from the UI
- **Authentication**: Use the "Authorize" button to add your JWT token
- **Detailed Schemas**: View complete data models and examples

## 📚 API Categories

### 🔐 Authentication
- `POST /api/v1/auth/signUp` - Register new user
- `POST /api/v1/auth/logIn` - User login
- `POST /api/v1/auth/admin/login` - Admin login
- `GET /api/v1/auth/google` - Google OAuth login
- `GET /api/v1/auth/google/callback` - Google OAuth callback

### 👤 Customer Management
- `GET /api/v1/customer/me` - Get current user profile
- `GET /api/v1/customer/car` - Get user's cars
- `POST /api/v1/customer/car` - Add new car
- `PATCH /api/v1/customer/car/{car_id}` - Update car
- `DELETE /api/v1/customer/car/{car_id}` - Delete car

### 📋 Policy Management
- `GET /api/v1/policy/policy-requests` - Get user's policy requests
- `POST /api/v1/policy/policy-requests` - Create new policy request
- `GET /api/v1/policy/policy-requests/{req_id}` - Get specific policy request

### 🚗 Accident Management
- `POST /api/v1/accident` - Report accident with image upload

### 🛡️ Admin Operations
- `GET /api/v1/admin/customers` - Get all customers
- `GET /api/v1/admin/customers/{id}` - Get customer by ID
- `GET /api/v1/admin/accidents` - Get all accidents
- `GET /api/v1/admin/accidents/{id}` - Get accident by ID
- `PATCH /api/v1/admin/accidents/{id}` - Update accident status
- `GET /api/v1/admin/payments` - Get all payments
- `GET /api/v1/admin/policies` - Get all policies

## 🔐 Authentication

### JWT Bearer Token
Most endpoints require JWT authentication:
1. Login to get a token
2. Click "Authorize" button in Swagger UI
3. Enter: `Bearer YOUR_JWT_TOKEN`

### Example Token Usage
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Data Models

### User Schema
```json
{
  "customer_id": 5,
  "customer_name": "Ahmed Mohamed",
  "customer_email": "ahmed@example.com",
  "customer_type": "Regular"
}
```

### Car Schema
```json
{
  "car_id": 12,
  "car_model": "Toyota Camry",
  "car_year": 2022,
  "car_plate": "ABC1234",
  "customer_id": 5
}
```

### Accident Schema
```json
{
  "accident_id": 1,
  "acc_description": "Rear collision at traffic light",
  "location": "Nasr City, Cairo",
  "accident_date": "2026-01-20",
  "car_id": 12,
  "customer_id": 5,
  "status": "pending"
}
```

### Policy Request Schema
```json
{
  "req_id": 1,
  "policy_type": "comprehensive",
  "coverage_amount": 50000,
  "car_id": 12,
  "customer_id": 5,
  "status": "pending"
}
```

## 🎯 Usage Examples

### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/signUp \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/logIn \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "john@example.com",
    "customer_password": "password123"
  }'
```

### 3. Add Car (Authenticated)
```bash
curl -X POST http://localhost:3000/api/v1/customer/car \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "car_model": "Honda Civic",
    "car_year": 2023,
    "car_plate": "XYZ5678"
  }'
```

### 4. Report Accident (Authenticated + File Upload)
```bash
curl -X POST http://localhost:3000/api/v1/accident \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "acc_description=Minor bumper damage" \
  -F "location=Downtown Cairo" \
  -F "accident_date=2026-01-20" \
  -F "car_id=12" \
  -F "customer_id=5" \
  -F "acc_image=@/path/to/image.jpg"
```

## 🔄 Configuration

### File Structure
```
MyProject/
├── swagger-config.js          # Main Swagger configuration
├── index.js                   # Express app with Swagger UI
├── SWAGGER_README.md         # This documentation
└── Routes/                    # Clean route files (no Swagger comments)
    ├── auth.js
    ├── AccidentRoute.js
    ├── PolicyRoute.js
    ├── admin.js
    └── users.js
```

### Customization
To modify the documentation:
1. Edit `swagger-config.js`
2. Update schemas, paths, or components
3. Restart your server
4. Refresh the Swagger UI

## 🚨 Important Notes

- **No Inline Comments**: All Swagger definitions are external
- **Clean Code**: Your route files remain clean and focused
- **Easy Maintenance**: Update documentation in one place
- **Version Control**: Changes to API docs are tracked separately
- **Testing**: Use Swagger UI for interactive API testing

## 🛠️ Development

### Adding New Endpoints
1. Implement your route in the appropriate file
2. Add the Swagger definition to `swagger-config.js`
3. Include it in the `paths` object
4. Define any new schemas in `components.schemas`

### Security Considerations
- JWT tokens expire after 30 minutes
- Use HTTPS in production
- Validate all input data
- Implement proper error handling

## 📞 Support

For questions about the API documentation:
1. Check the Swagger UI at `/api-docs`
2. Review this README file
3. Examine the `swagger-config.js` file
4. Test endpoints using the interactive UI

---

**Note**: This documentation is maintained externally from your source code, making it easy to update without cluttering your business logic with documentation comments.
