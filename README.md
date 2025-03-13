# 🚀 Crowdfunding Platform

A full-stack crowdfunding platform where users can create campaigns, donate, and save campaigns. The platform provides an admin panel for managing users, campaigns, and donations efficiently.

## 🌟 Features

### 🔹 User Features
- Sign up, log in, and manage profile
- Create, edit, and delete fundraising campaigns
- Donate to campaigns securely
- Save favorite campaigns for later
- View donation history

### 🔹 Admin Features
- View & manage all users, campaigns, and donations
- Perform searches for campaigns, users, and donations
- Monitor analytics (total users, total campaigns, total donations)
- Delete or edit user-generated campaigns

### 🔹 Additional Features
- Authentication & Authorization (JWT-based authentication)
- Secure payment gateway integration
- Contact form with email notifications
- Responsive UI with a modern, eye-catching design

## 🛠️ Tech Stack

### 💻 Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### 🌐 Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Cloudinary for image storage
- Nodemailer for contact form emails
- JWT authentication

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ansarialiakbar/crowdfunding-platform.git
cd crowdfunding-platform
```

### 2️⃣ Install Dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the `backend` directory and add:
```ini
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4️⃣ Start the Development Servers
```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm start
```

## 📌 API Endpoints
### 🔹 Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/logout` - Logout the user

### 🔹 Campaigns
- `GET /api/campaigns` - Fetch all campaigns
- `POST /api/campaigns` - Create a campaign
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns/donate` - Donate to a campaign

### 🔹 Users
- `GET /api/users/:id` - Fetch user profile
- `POST /api/users/:id/save-campaign` - Save/unsave a campaign
- `GET /api/users/:id/saved-campaigns` - Get saved campaigns

### 🔹 Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/campaigns` - Get all campaigns
- `GET /api/admin/donations` - Get all donations
- `DELETE /api/admin/campaigns/:id` - Delete a campaign

## 🛠️ Project Structure
```
/crowdfunding-platform
│── /frontend       # React frontend
│── /backend        # Express backend
│── /public         # Static assets
│── .env.example    # Example environment variables
│── README.md       # Project documentation
``` 
## Project Live Link
```
https://timely-crepe-a97594.netlify.app
```

## 🤝 Contributing
Want to contribute? Feel free to fork the repo and submit a pull request.

## 📞 Contact
For any queries, reach out via email: support@example.com

## 📜 License
This project is licensed under the MIT License. Feel free to use and modify it as needed.

