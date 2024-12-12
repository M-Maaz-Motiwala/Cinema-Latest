
# 🎥 Cinema App  

> A robust movie ticket booking and management system built on the MERN stack. This app allows users to browse movies, select showtimes, choose seats, and manage their profiles. Admins can manage movies, halls, and bookings efficiently.

---

## Table of Contents  

1. [Features](#features)  
2. [Technologies Used](#technologies-used)  
3. [Installation & Setup](#installation--setup)  
4. [Environment Variables](#environment-variables)  
5. [Folder Structure](#folder-structure)  
6. [Backend API Routes](#backend-api-routes)  
7. [Screenshots](#screenshots)  
8. [Future Enhancements](#future-enhancements)  
9. [License](#license)

---

## Features  

### User Features  
- Browse movies and showtimes.  
- Select seats and book tickets.  
- Update personal profiles and passwords.  

### Admin Features  
- Manage movies, halls, and showtimes.  
- View and manage user bookings.  

### Additional Features  
- Secure authentication using JWT.  
- Profile picture upload functionality.  
- Real-time seat availability updates.  

---

## Technologies Used  

**Frontend:**  
- React.js  
- Tailwind CSS  
- Redux (for state management)  

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MongoDB Atlas  
- Mongoose  

**Others:**  
- Axios  
- React Icons  
- Formidable (for file uploads)  

---

## Installation & Setup  

### Prerequisites  
- Node.js and npm installed.  
- MongoDB Atlas account setup.  

### Clone the Repository  
\`\`\`bash
git clone https://github.com/yourusername/cinema-app.git
cd cinema-app
\`\`\`

### Install Dependencies  
#### Backend  
\`\`\`bash
cd backend
npm install
\`\`\`

#### Frontend  
\`\`\`bash
cd frontend
npm install
\`\`\`

### Run the App  
#### Backend  
\`\`\`bash
npm start
\`\`\`

#### Frontend  
\`\`\`bash
npm start
\`\`\`

The app will be available at \`http://localhost:3000\`.

---

## Environment Variables  

Create a \`.env\` file in the **backend** directory and add the following:  
\`\`\`env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
REACT_APP_BACKEND_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL_STATIC=http://localhost:5000
\`\`\`

---

## Folder Structure  

### Backend (\`/backend\`)  
\`\`\`
backend/
│
├── src/
│   ├── config/        # Database and environment configurations  
│   ├── controllers/   # Route controllers for handling requests  
│   ├── models/        # Mongoose models  
│   ├── routes/        # API routes  
│   └── utils/         # Utility functions  
│
├── server.js          # Entry point for the backend server  
└── package.json       # Backend dependencies  
\`\`\`

### Frontend (\`/frontend\`)  
\`\`\`
frontend/
│
├── src/
│   ├── components/    # Reusable components  
│   ├── pages/         # Pages corresponding to routes  
│   ├── redux/         # Redux store and slices  
│   └── styles/        # Tailwind CSS configurations  
│
├── public/            # Static files  
├── package.json       # Frontend dependencies  
└── tailwind.config.ts # Tailwind configuration  
\`\`\`

---

## Backend API Routes  

### Authentication  
- \`POST /auth/login\` - Login a user.  
- \`POST /auth/register\` - Register a new user.  

### Users  
- \`GET /users/profile\` - Fetch user profile.  
- \`PUT /users/profile\` - Update user profile details.  
- \`POST /users/profile-picture\` - Upload profile picture.  

### Movies  
- \`GET /movies\` - Fetch all movies.  
- \`POST /movies\` - Add a new movie.  

### Bookings  
- \`GET /bookings\` - Fetch all bookings.  
- \`POST /bookings\` - Create a new booking.  

For a complete list of routes and request/response formats, check the **API Documentation** in the \`backend/docs/\` folder.

---

## Screenshots  

### Home Page  
*(Add an image of the Home Page here)*  

### Admin Dashboard  
*(Add an image of the Admin Dashboard here)*  

### Seat Selection  
*(Add an image of the Seat Selection feature here)*  

---

## Future Enhancements  

- Implement a payment gateway for seamless transactions.  
- Add real-time notifications for booking updates.  
- Optimize performance for handling large data sets.  

---

## License  

This project is licensed under the MIT License.  
