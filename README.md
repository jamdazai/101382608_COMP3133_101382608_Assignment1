# COMP 3133 - Full Stack Development

## **Assignment 1**

### **Author:** Jam Furaque

---

## **📌 Project Overview**
This project is a **GraphQL-based Employee Management System** built using **Node.js, Express, MongoDB, and Apollo Server**. It allows authenticated users to **add, search, update, and delete employees** while ensuring proper validation using `express-validator`.

### **🚀 Features**
- **GraphQL API** with Employee CRUD operations
- **User Authentication** (Signup/Login with JWT)
- **Middleware for Authorization** (Protects Employee Actions)
- **Express Validator for Input Validation**
- **MongoDB Database with Mongoose ORM**
- **Secure Password Hashing using bcrypt.js**

---

## **🛠️ Tech Stack**
- **Backend:** Node.js, Express.js, GraphQL (Apollo Server)
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token) Authentication
- **Validation:** Express Validator

---


## **📌 GraphQL API Usage**
### **🔹 1️⃣ Signup (User Registration)**
#### **Mutation**
```graphql
mutation ($userInput: UserInput!) {
  signup(userInput: $userInput) {
    _id
    username
    email
  }
}
```
#### **Example Variables:**
```json
{
  "userInput": {
    "username": "<username here>",
    "email": "<valid email here>",
    "password": "password123"
  }
}
```

---

### **🔹 2️⃣ Login (User Authentication)**
#### **Query**
```graphql
query ($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
```
#### **Example Variables:**
```json
{
  "usernameOrEmail": "<username here>",
  "password": "password123"
}
```

---

### **🔹 3️⃣ Add a New Employee**
#### **Mutation**
```graphql
mutation ($employeeInput: EmployeeInput!) {
  createEmployee(employeeInput: $employeeInput) {
    _id
    firstName
    lastName
    email
    designation
  }
}
```
#### **Example Variables:**
```json
{
  "employeeInput": {
    "firstName": "Tony",
    "lastName": "Stark",
    "email": "tony.stark@example.com",
    "gender": "Male",
    "designation": "Software Engineer",
    "salary": 5000,
    "date_of_joining": "2023-01-15",
    "department": "Engineering",
    "employeePhoto": "tony_stark.jpg"
  }
}
```

---

### **🔹 4️⃣ Get All Employees**
#### **Query**
```graphql
query {
  getAllEmployees {
    _id
    firstName
    lastName
    email
    designation
    department
    salary
    date_of_joining
  }
}
```

---

### **🔹 5️⃣ Search Employee by Designation or Department**
#### **Query**
```graphql
query ($input: EmployeeSearchInput!) {
  searchEmployeeBy(input: $input) {
    _id
    firstName
    lastName
    email
    designation
    department
  }
}
```
#### **Example Variables:**
```json
{
  "input": {
    "designation": "Software Engineer"
  }
}
```

---

### **🔹 6️⃣ Update an Employee**
#### **Mutation**
```graphql
mutation ($eid: ID!, $employeeInput: EmployeeInput!) {
  updateEmployee(eid: $eid, employeeInput: $employeeInput) {
    _id
    firstName
    lastName
    email
  }
}
```
#### **Example Variables:**
```json
{
  "eid": "67957424a722ffbeaa264468",
  "employeeInput": {
    "lastName": "Married"
  }
}
```

---

### **🔹 7️⃣ Delete an Employee**
#### **Mutation**
```graphql
mutation ($eid: ID!) {
  deleteEmployee(eid: $eid)
}
```
#### **Example Variables:**
```json
{
  "eid": "67957424a722ffbeaa264468"
}
```

---

## **🛠️ Known Issues & Future Improvements**
✅ Implement Role-Based Access Control (RBAC) for better security.
✅ Add logging and monitoring for production readiness.
✅ Improve input validation using GraphQL custom scalar types.

---

## **💡 Conclusion**
This GraphQL-based Employee Management System provides a solid foundation for managing employees in a secure and efficient manner. With JWT authentication and express-validator, it ensures both **security** and **data integrity**.

---

**🔹 Author:** Jam Furaque

