# Vinnare-Front

## Description
Vinnare-Front is a modern e-commerce application built with React and TypeScript. It offers an intuitive shopping experience for users and a robust admin panel for managing products, categories, and users.

## Technology Stack
| Category | Technologies |
|-----------|-------------|
| Core Framework | React 19, TypeScript |
| Build System | Vite 6.3.1 |
| Routing | React Router DOM 7.5.3 |
| Styling | Tailwind CSS 4.1.5 |
| Form Handling | React Hook Form 7.56.2, Zod 3.24.3 |
| API Communication | Axios 1.9.0 |
| Authentication | JWT (jwt-decode 4.0.0) |
| UI Components | Lucide React 0.510.0, React Icons 5.5.0 |
| Notifications | React Hot Toast 2.5.2 |

## Architecture
![System Architecture](https://github.com/user-attachments/assets/d65126ae-27eb-41a2-8c43-98c951a14f44)


The application follows a component-based architecture with the following main features:
- State management using Context API
- Role-based protected routes
- RESTful API integration
- JWT authentication handling
- Feature-based folder structure

## How to Run the Project

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/Frank5005/vinnare-front.git
cd vinnare-front
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with the necessary configurations.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```bash
http://localhost:5173
```

## User Role System and Allowed Pages

### Role: Admin
Full access to the admin panel:
- `/admin/homepage` - Main dashboard
- `/admin/products-list` - Product management
- `/admin/create-product` - Product creation
- `/admin/categories-list` - Category management
- `/admin/create-category` - Category creation
- `/admin/view-all-users` - User management
- `/admin/create-employee` - Employee creation
- `/admin/jobs-list` - Job management

### Role: Seller
Limited access to the admin panel:
- `/admin/homepage` - Main dashboard
- `/admin/products-list` - Product management
- `/admin/create-product` - Product creation
- `/admin/categories-list` - Category management

### Role: Shopper
Access to shopping features:
- `/shop-list` - Product listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout-address` - Checkout process (address)
- `/checkout-shipping` - Checkout process (shipping)
- `/checkout-payment` - Checkout process (payment)
- `/my-orders` - Order history
- `/wishlist` - Wishlist

## Folder Structure
```
src/
├── components/     # Reusable components
├── features/       # Specific features
├── hooks/         # Custom hooks
├── pages/         # Application pages
├── services/      # Services and API calls
├── types/         # TypeScript type definitions
└── utils/         # Utilities and helpers
```

## Example Flow
![System Architecture](https://github.com/user-attachments/assets/295b2330-aebf-402a-ac8c-4633b675b3f2)


## Test Coverage
The project includes comprehensive test coverage for:
- Components
- Services
- Hooks
- Utils

To run the tests:
```bash
npm test
```

To check test coverage:
```bash
npm test -- --coverage
```
