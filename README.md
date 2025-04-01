# Vibe Connect

Vibe Connect is a web application that facilitates seamless interaction between users. It features a React frontend, a Django backend with Django REST Framework (DRF), and a cloud-based database (NenoDB).

## Repository Link
[GitHub Repository](https://github.com/MUKILAN019/Vibe_Connect)

## Deployed Links
- **Backend**: [Vibe Connect Backend](https://vibe-connect-15wk.onrender.com/)
- **Frontend**: [Vibe Connect Frontend](https://vibe-connect-nine.vercel.app/)

---

## Technology Stack
- **Frontend**: React
- **Backend**: Python (Django with Django REST Framework)
- **Database**: NenoDB (Cloud-based service)

---

## Installation & Setup Guide

### Prerequisites
Ensure you have the following installed:
- Python (3.x)
- Node.js (for frontend)
- Git

### Backend Setup (Django REST Framework)

1. **Clone the repository:**
   ```sh
   git clone https://github.com/MUKILAN019/Vibe_Connect.git
   cd Vibe_Connect/server
   ```

2. **Create a virtual environment and activate it:**
   ```sh
   python -m venv venv
   source venv/Scripts/activate  
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```sh
   python manage.py migrate
   ```

5. **Start the development server:**
   ```sh
   python manage.py runserver  
   ```
   - Keep `DEBUG = True` in `.env` during development.

6. **For production deployment:**
   ```sh
   daphne tasks_management.asgi:application --port 8000 --bind 0.0.0.0
   ```

---

### Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```sh
   cd ../client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

---

## Usage Instructions

### Authentication Details
- **Vibe Copilot Users (Kalvium Community Mail):** All assigned users have password `1234567`.
- **Vibe Copilot Test Account:**
  - Username: `sham@gmail.com`
  - Password: `123456`

### API Endpoints
For detailed API documentation, visit: **[Backend API](https://vibe-connect-15wk.onrender.com/)**

---

## Notes
- Always keep `DEBUG = True` during development.
- In production, use **Daphne** instead of the default development server.
- Ensure environment variables are configured correctly before deployment.



