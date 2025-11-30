# Car Insurance System – Backend (Node.js)

This repository contains the backend of a **Car Insurance Management System**, built with **Node.js** and **Express**.  
It provides RESTful APIs for managing customers, cars, insurance policies, accidents, and claims.

---

## 🚀 Features

- Customer registration & authentication (login / signup)
- Car management (register, update, link to customer)
- Insurance policy creation & management
- Accident logging and file uploads (e.g. images / reports)
- Secure APIs using JWT authentication
- Integration with Microsoft SQL Server database
- Structured controllers, routes, and middlewares for clean architecture

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Microsoft SQL Server (via `msnodesqlv8` or similar driver)
- **Authentication:** JWT
- **Environment variables:** `data.env`
- **Other:** Multer / file upload (if used), Validation middlewares, etc.

---

## 📂 Project Structure (simplified)

```text
MyProject/
  Controllers/
  Routes/
  Models/
  middlewares/
  dev-data/
  images/
  node_modules/
  data.env      # environment variables (NOT committed)
  Token.txt     # local token (ignored)
  index.js      # server entry point
  package.json
  README.md
