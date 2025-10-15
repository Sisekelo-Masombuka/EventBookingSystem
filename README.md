# 🎉 Mzansi Moments Hub - Event Booking System

A complete full-stack web application for discovering, booking, and managing events across South Africa. Built with ASP.NET Core Web API backend and React frontend.

## 🌟 Features

### 🎫 **Event Management**
- Browse events with advanced filtering (city, category, price range)
- Search events by keywords
- Detailed event pages with ticket selection
- Real-time availability tracking

### 👤 **User Authentication**
- User registration and login
- JWT-based authentication
- Profile management
- Password security with hashing

### 🛒 **Booking System**
- Shopping cart functionality
- Multiple payment methods (Card & Money Market QR)
- Booking expiration (1 hour timeout)
- Order confirmation and tracking

### 🎟️ **Ticket Management**
- PDF ticket generation
- QR code integration
- Email delivery system
- Download from dashboard

### 👨‍💼 **Admin Portal**
- Event creation and management
- Booking analytics and reporting
- User management
- Revenue tracking

## 🚀 Technology Stack

### **Backend (ASP.NET Core 8)**
- **Framework**: ASP.NET Core 8 Web API
- **Database**: Entity Framework Core with SQL Server
- **Authentication**: JWT Bearer Tokens
- **Security**: BCrypt password hashing
- **API**: RESTful endpoints

### **Frontend (React)**
- **Framework**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS + DaisyUI
- **UI Components**: Flowbite, React Icons
- **Forms**: React Hook Form + Yup validation
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## 📁 Project Structure

```
EventBookingSystem/
├── Controllers/           # API Controllers
├── Models/               # Data Models
├── Data/                 # Database Context
├── system-frontend/      # React Application
│   ├── src/
│   │   ├── components/   # Reusable UI Components
│   │   ├── pages/        # Page Components
│   │   ├── redux/        # State Management
│   │   └── services/     # API Services
│   └── public/           # Static Assets
└── README.md
```

## 🛠️ Installation & Setup

### **Prerequisites**
- .NET 8 SDK
- SQL Server (LocalDB or full instance)
- Node.js 16+ and npm
- Visual Studio or VS Code

### **Backend Setup**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventBookingSystem
   ```

2. **Install dependencies**
   ```bash
   dotnet restore
   ```

3. **Configure database**
   - Update connection string in `appsettings.json`
   - Run migrations:
   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

4. **Run the backend**
   ```bash
   dotnet run
   ```
   Backend will be available at: `https://localhost:7037`

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd system-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   Frontend will be available at: `http://localhost:3000`

## 🗄️ Database Schema

### **Core Entities**
- **User**: User accounts and profiles
- **Event**: Event information and details
- **TicketType**: Different ticket categories for events
- **Booking**: User booking records
- **BookingItem**: Individual ticket items in bookings
- **Payment**: Payment transaction records

### **Key Relationships**
- User → Bookings (One-to-Many)
- Event → TicketTypes (One-to-Many)
- Booking → BookingItems (One-to-Many)
- Booking → Payment (One-to-One)

## 🔐 Authentication & Security

### **JWT Configuration**
- **Issuer**: MzansiMomentsHub
- **Audience**: MzansiMomentsHubUsers
- **Expiration**: 24 hours
- **Algorithm**: HMAC SHA256

### **Password Security**
- BCrypt hashing with salt rounds
- Minimum 6 character requirement
- Secure password validation

## 📱 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### **Events**
- `GET /api/events` - List all events (with filtering)
- `GET /api/events/{id}` - Get event details
- `GET /api/events/cities` - Get available cities
- `GET /api/events/categories` - Get event categories

### **Bookings**
- `POST /api/bookings/add-to-cart` - Add tickets to cart
- `GET /api/bookings/cart` - Get current cart
- `POST /api/bookings/checkout` - Process checkout
- `DELETE /api/bookings/cart/{id}` - Clear cart

### **Payments**
- `POST /api/payments/card` - Process card payment
- `POST /api/payments/money` - Generate QR payment
- `POST /api/payments/confirm` - Confirm payment

### **Users**
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/bookings` - Get user bookings

### **Admin**
- `GET /api/admin/overview` - Get admin dashboard data
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/admin/events` - Create new event
- `PUT /api/admin/events/{id}` - Update event
- `DELETE /api/admin/events/{id}` - Delete event

## 🎨 Frontend Features

### **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- DaisyUI components for consistency
- Smooth animations with Framer Motion

### **State Management**
- Redux Toolkit for global state
- Separate slices for auth, events, cart
- Async thunks for API calls
- Persistent authentication state

### **User Experience**
- Loading states and error handling
- Toast notifications for feedback
- Form validation with Yup
- Protected routes for authentication

## 🔧 Configuration

### **Environment Variables**
Create `.env` file in frontend root:
```env
REACT_APP_API_URL=https://localhost:7037/api
```

### **Database Connection**
Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MzansiMomentsHub;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

## 🧪 Testing

### **Backend Testing**
```bash
# Run unit tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### **Frontend Testing**
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 🚀 Deployment

### **Backend Deployment**
1. Publish the application:
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. Deploy to your hosting provider (Azure, AWS, etc.)

### **Frontend Deployment**
1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy to static hosting (Netlify, Vercel, etc.)

## 📊 Sample Data

The system includes seeded data:
- **Admin User**: admin@mzansimomentshub.com / admin
- **Sample Events**: Cape Town Jazz Festival, Tech Conference SA, Springbok Rugby Match
- **Ticket Types**: General, VIP, Early Bird categories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: info@mzansimomentshub.com
- Phone: +27 11 123 4567
- Location: Sol Plaatje University, Kimberley, South Africa

## 🎯 Roadmap

### **Phase 1** ✅
- [x] Basic event browsing and booking
- [x] User authentication and profiles
- [x] Shopping cart and checkout
- [x] Admin portal for event management

### **Phase 2** 🚧
- [ ] PDF ticket generation
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Mobile app (React Native)

### **Phase 3** 📋
- [ ] Event reviews and ratings
- [ ] Social media integration
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Built with ❤️ in South Africa** 🇿🇦

