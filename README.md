# Car Insurance System – Backend (Node.js)

This repository contains the backend of a **Car Insurance Management System**, built with **Node.js** and **Express**.  
It provides RESTful APIs for managing customers, cars, insurance policies, accidents, and claims with comprehensive authentication and authorization.

---

## 🚀 Features

### **User Authentication & Authorization System**
- **Secure User Registration**: Complete customer signup with email validation and password hashing using bcryptjs
- **JWT-Based Login**: Secure authentication with JSON Web Tokens for session management
- **Role-Based Access Control**: Three-tier permission system (Regular, Individual, Admin) with route protection
- **Google OAuth Integration**: Optional Google authentication support via Passport.js
- **Password Security**: Advanced password hashing and validation mechanisms

### **Customer Management Portal**
- **Complete Profile Management**: Full CRUD operations for customer profiles and personal information
- **Role Assignment System**: Dynamic user role management and permissions
- **Customer Data Protection**: Secure handling of sensitive customer information
- **Profile Updates**: Real-time profile editing and data synchronization

### **Vehicle Management System**
- **VIN Decoder Integration**: Automatic vehicle data retrieval using VIN number via NHTSA API
- **Smart Car Registration**: Users enter VIN number and system auto-fills make, model, and year
- **Real-time Vehicle Data**: Live API integration with National Highway Traffic Safety Administration database
- **Car Registration**: Complete vehicle registration with auto-populated vehicle details
- **Customer-Car Linking**: Associate multiple vehicles with single customer accounts
- **Vehicle Verification**: Car validation and verification processes
- **Document Management**: Upload and manage vehicle documents and images

### **Insurance Policy Management**
- **Policy Creation**: Comprehensive insurance policy creation with customizable coverage options
- **Policy Request Workflow**: Complete policy request and approval system
- **Admin Policy Dashboard**: Administrative interface for policy management and oversight
- **Policy Status Tracking**: Real-time policy status updates and notifications
- **Policy Renewals**: Automated policy renewal reminders and processing

### **Accident & Claims Processing**
- **Accident Reporting**: Detailed accident logging with location, time, and damage assessment
- **File Upload System**: Secure upload of accident photos, police reports, and supporting documents
- **Claims Management**: Complete claims processing workflow from submission to settlement
- **Accident History**: Comprehensive accident history tracking and analytics
- **Damage Assessment**: Tools for evaluating and documenting vehicle damage

### **API Documentation & Testing**
- **Swagger/OpenAPI 3.0**: Complete API documentation with interactive explorer
- **Interactive API Testing**: Built-in API testing interface at `/api-docs`
- **Endpoint Documentation**: Detailed documentation for all API endpoints
- **Request/Response Examples**: Clear examples for API usage

### **Advanced Security Features**
- **JWT Authentication Middleware**: Secure token-based authentication for all protected routes
- **Role-Based Route Protection**: Middleware-based access control for different user types
- **Input Validation & Sanitization**: Comprehensive data validation and XSS protection
- **CORS Configuration**: Cross-Origin Resource Sharing setup for frontend integration
- **SQL Injection Protection**: Parameterized queries and database security measures

### **System Administration**
- **User Management**: Admin tools for managing all system users
- **Policy Oversight**: Administrative dashboard for monitoring all insurance policies
- **System Analytics**: Reporting and analytics for business intelligence
- **Audit Logging**: Track system changes and user activities

### **Integration & Automation**
- **Email Notifications**: Automated email alerts for policy updates and claims
- **File Processing**: Automated processing of uploaded documents and images
- **Database Integration**: Seamless integration with Microsoft SQL Server
- **Third-Party APIs**: Integration capabilities for external services

---

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** Microsoft SQL Server (via `msnodesqlv8`)
- **Authentication:** JWT + Passport.js
- **API Documentation:** Swagger/OpenAPI 3.0
- **File Uploads:** Multer
- **Security:** bcryptjs, CORS, cookie-parser
- **Additional:** Puppeteer, Axios, Luxon for date handling

---

## 📂 Project Structure

```text
MyProject/
├── Controllers/           # Business logic controllers
│   ├── AccidentControl.js
│   ├── PolicyControl.js
│   ├── admin.js
│   ├── auth.js
│   ├── carControl.js
│   └── users.js
├── Routes/               # API route definitions
│   ├── AccidentRoute.js
│   ├── PolicyRoute.js
│   ├── admin.js
│   ├── auth.js
│   ├── policyadmin.js
│   └── users.js
├── Models/               # Database models
├── middlewares/          # Custom middlewares
├── utils/               # Utility functions
│   └── passport.js      # Passport configuration
├── src/                 # Additional source files
├── images/              # Uploaded images storage
├── index.js             # Main application entry point
├── server.js            # Server configuration
├── swagger.js           # API documentation setup
├── data.env             # Environment variables (NOT committed)
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Microsoft SQL Server
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MyProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `data.env` file in the root directory
   - Configure your database connection and JWT secrets
   ```env
   DB_SERVER=your_server_name
   DB_DATABASE=your_database_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=your_token_expiry
   ```

4. **Database Setup**
   - Ensure your SQL Server is running
   - Create the necessary database and tables
   - Update connection details in `data.env`

5. **Start the Server**
   ```bash
   node index.js
   ```

---

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI:** `http://localhost:3000/api-docs`
- **API Base URL:** `http://localhost:3000/api/v1`

### Main API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/auth/google` - Google OAuth (if configured)

#### Customer Management
- `GET /api/v1/customer/profile` - Get customer profile
- `PATCH /api/v1/customer/profile` - Update customer profile

#### Policy Management
- `GET /api/v1/policy` - Get user policies
- `POST /api/v1/policy` - Create new policy
- `GET /api/v1/policy/admin` - Admin policy management

#### Admin Routes
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/policies` - Get all policies

---

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in your requests:

```javascript
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **Regular:** Standard customer access
- **Individual:** Individual customer access
- **Admin:** Full administrative access

---

## 🗄 Database Schema

The system uses Microsoft SQL Server with the following main entities:
- Users/Customers
- Cars
- Insurance Policies
- Accidents
- Claims
- Policy Requests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Ahmed Sheref**

---

## 📞 Support

For any queries or support, please reach out to the project maintainer.
