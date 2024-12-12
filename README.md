
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

---

## Installation & Setup  

### Prerequisites  
- Node.js and npm installed.  
- MongoDB Atlas account setup.  

### Clone the Repository  
```bash
git clone [https://github.com/M-Maaz-Motiwala/Cinema-Latest.git]
cd cinema-app
```

### Install Dependencies  
#### Backend  
```bash
cd backend
npm install
```

#### Frontend  
```bash
cd frontend
npm install
```

### Run the App  
#### Backend  
```bash
npm start
```

#### Frontend  
```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables  

Create a `.env` file in the **backend** directory and add the following:  
```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<xyz@gmail.com>
EMAIL_PASS=<password>
CLIENT_URL=http://localhost:3000
```
Create a `.env` file in the **frontend** directory and add the following:  
```env
REACT_APP_BACKEND_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL_STATIC=http://localhost:5000
```
---

## Backend API Routes  

### Authentication  
- `POST /auth/login` - Login a user.  
- `POST /auth/register` - Register a new user.

### Users  
- `GET /users/profile` - Fetch user profile.  
- `PUT /users/profile` - Update user profile details.  
- `POST /users/profile-picture` - Upload profile picture.  

### Movies  
- `GET /movies` - Fetch all movies.  
- `POST /movies` - Add a new movie.  

### Bookings  
- `GET /bookings` - Fetch all bookings.  
- `POST /bookings` - Create a new booking.

For a complete list of routes and request/response formats, check the **ROUTES** in the `backend/src/routes/` folder.

---

## Screenshots  

### Login Register and User Dashboard  
![Login](https://github.com/user-attachments/assets/27223b12-2e11-43e0-a919-24247f6fdfc0)
![Register](https://github.com/user-attachments/assets/bc9c4ffc-8792-4cd1-999b-9dcec0999d2e)
![UserDashboard](https://github.com/user-attachments/assets/6ec30692-9865-4c0c-8b29-a672b1b2d284)

### Home Page  
![homepage12](https://github.com/user-attachments/assets/363a09f5-a8ec-484b-8896-797553f31e50)
![homepage2](https://github.com/user-attachments/assets/94541155-6b5c-473b-b8b2-1a0d69b02001)

### Showtime Page 
![Showtimepage](https://github.com/user-attachments/assets/c49bebf6-066d-40dc-9b38-8243d7a4fb95)

### Movie Page with its trailer on hover  
![Moviepage](https://github.com/user-attachments/assets/0edabe5d-71cd-4629-bc37-f1b7a9c24ad1)

### Booking Page  
![Booking Page](https://github.com/user-attachments/assets/9972f5a1-1347-4b24-89e8-ba5c62798ac2)

### Seat Selection  
![SeatingLayout](https://github.com/user-attachments/assets/f0daf52d-159a-4efb-94a9-b2387d001302)

### Payment Page  
![PaymentPage](https://github.com/user-attachments/assets/4f12f3b0-0cfe-46cb-8253-d53d6f4bf184)

### Admin Dashboard and its features
![AdminDashboard](https://github.com/user-attachments/assets/6c6ba424-9c21-4acb-9bd8-02bfba38e777)
![ManageHalls](https://github.com/user-attachments/assets/6f181744-4e43-457e-b500-1bb94ab225e2)
![ManageMovies](https://github.com/user-attachments/assets/d3e68278-bd65-4bc0-9f33-2b2fcfd89c2d)
![ManageShowtimes](https://github.com/user-attachments/assets/b8d7a1b3-8be4-4cad-8673-b2fd73b822df)
![UserManagement](https://github.com/user-attachments/assets/7e57c8e8-f4a0-48a3-b9a4-7440a66a8e9f)



---

## Future Enhancements  

- Implement a payment gateway for seamless transactions.  
- Add real-time notifications for booking updates.  

---

## License  

This project is licensed under the MIT License.  
