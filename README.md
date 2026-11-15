# Code-a-Nova 🚀

**Code-a-Nova** is a MERN stack-based hackathon registration platform that allows participants to create accounts, verify their email addresses, and register their teams for a hackathon.

The platform provides a centralized registration experience with user authentication, team registration, and email notifications.

## 🌐 Live Demo

- **Frontend:** https://code-a-nova-black.vercel.app
- **Backend API:** https://code-a-nova-backend.onrender.com
- **GitHub Repository:** https://github.com/Khushiee-23/Code-a-Nova

## ✨ Features

- **User Authentication:** Secure user signup and login.
- **Email Verification:** OTP-based email verification during registration.
- **Team Registration:** Register a hackathon team with its leader and team members.
- **Registration Management:** View and remove your registered team.
- **Email Notifications:** Send registration confirmations to team members.
- **Protected Routes:** Restrict access to authenticated users.
- **Responsive Interface:** Access the platform across different screen sizes.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- Resend (Email API)

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📁 Project Structure

```text
HackSphere/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Khushiee-23/Code-a-Nova.git
```

### 2. Navigate to the Project

```bash
cd Code-a-Nova
```

### 3. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

Start the backend:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 4. Set Up the Frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key used for JWT authentication |
| `CLIENT_URL` | Frontend URL allowed by backend CORS |
| `RESEND_API_KEY` | API key used for email delivery |
| `VITE_API_URL` | Backend API URL used by the frontend |

**Important:** Never commit `.env` files or expose API keys, database credentials, or JWT secrets publicly.

## 🚀 Deployment

The application is deployed using:

- **Vercel** for the React frontend.
- **Render** for the Express backend.
- **MongoDB Atlas** for database hosting.

Production environment variables must be configured in the respective deployment dashboards.

For email delivery, configure a valid Resend API key and an appropriately verified sender.

## 🔮 Future Improvements

- Admin dashboard for managing registrations.
- Improved team management functionality.
- Enhanced registration status tracking.
- More robust email notification handling.
- Additional security and validation improvements.

## 👩‍💻 Author

**Code-a-Nova** — A hackathon registration platform built using the MERN stack.

---

⭐ If you find this project interesting, consider giving the repository a star!
