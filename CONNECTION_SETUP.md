# Frontend ↔ Backend Connection Setup

## Overview
This project demonstrates a successful connection between a React frontend and ASP.NET Core Web API backend.

## Architecture
- **Frontend**: React Application (Port 3000)
- **Backend**: ASP.NET Core Web API (Port 7037)
- **Communication**: HTTP/HTTPS REST API with CORS enabled

## Setup Instructions

### 1. Start the Backend (ASP.NET Core API)
```bash
# Navigate to the project root
cd "C:\Users\Sisekelo Masombuka\source\repos\EventBookingSystem"

# Run the backend
dotnet run
```
The backend will start on:
- HTTPS: https://localhost:7037
- HTTP: http://localhost:5287

### 2. Start the Frontend (React App)
```bash
# Navigate to the frontend directory
cd "C:\Users\Sisekelo Masombuka\source\repos\EventBookingSystem\system-frontend"

# Install dependencies (if not already done)
npm install

# Start the React development server
npm start
```
The frontend will start on: http://localhost:3000

## Testing the Connection

1. Open your browser and go to http://localhost:3000
2. The page will automatically test the connection on load
3. You can manually test the connection using the buttons:
   - **Test Connection Status**: Tests the `/api/connection/status` endpoint
   - **Test API Endpoint**: Tests the `/api/connection/test` endpoint

## API Endpoints

### Connection Status
- **URL**: `GET https://localhost:7037/api/connection/status`
- **Description**: Returns connection status and system information

### Connection Test
- **URL**: `GET https://localhost:7037/api/connection/test`
- **Description**: Tests API functionality and returns server data

## Features Implemented

### Backend (ASP.NET Core)
- ✅ CORS configuration for React app
- ✅ Connection controller with test endpoints
- ✅ JSON response formatting
- ✅ Error handling

### Frontend (React)
- ✅ Modern UI with gradient background
- ✅ Real-time connection testing
- ✅ Error handling and display
- ✅ Responsive design
- ✅ Auto-test on page load

## Troubleshooting

### If connection fails:
1. Ensure both applications are running
2. Check that the backend is running on port 7037
3. Verify CORS is properly configured
4. Check browser console for detailed error messages

### Common Issues:
- **CORS Error**: Backend CORS policy should allow `http://localhost:3000`
- **Port Conflicts**: Ensure ports 3000 and 7037 are available
- **HTTPS Certificate**: Browser may show security warning for self-signed certificates

## Next Steps
Once the connection is established, you can proceed to build your Event Booking System features!

