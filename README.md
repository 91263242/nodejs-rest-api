# Node.js REST API with MongoDB Cursor-Based Pagination

A scalable RESTful API built with Node.js, Express, and MongoDB that implements cursor-based pagination for efficient handling of large datasets. Features JWT authentication and follows MVC architecture.

## Features

- ✅ **Cursor-based pagination** for efficient data retrieval without loading entire collections
- ✅ **RESTful API endpoints** with filtering, sorting, and pagination
- ✅ **JWT authentication** for secure access to API resources
- ✅ **Scalable architecture** for handling large datasets
- ✅ **Modular and maintainable** code structure following MVC pattern
- ✅ **MongoDB cursors** for efficient streaming of data

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Postman** - API testing (recommended)

## Project Structure

```
nodejs-rest-api/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── itemController.js    # Item CRUD operations with cursor pagination
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   └── Item.js              # Item model
├── routes/
│   ├── auth.js              # Authentication routes
│   └── items.js             # Item routes
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── server.js               # Application entry point
└── README.md               # Project documentation
```

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd nodejs_projects
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 3000)

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Seed sample data (optional)**
   ```bash
   npm run seed
   ```
   This will populate the database with sample items for testing.

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Items (Protected Routes)

#### Get Items with Cursor Pagination
```http
GET /api/items?cursor=<base64_cursor>&limit=10&sortBy=createdAt&sortOrder=desc&category=electronics&status=active&minPrice=10&maxPrice=1000&search=laptop
Authorization: Bearer <token>
```

**Query Parameters:**
- `cursor` - Base64 encoded cursor for pagination (optional)
- `limit` - Number of items per page (default: 10)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - Sort order: 'asc' or 'desc' (default: desc)
- `category` - Filter by category (optional)
- `status` - Filter by status: active, inactive, archived (optional)
- `minPrice` - Minimum price filter (optional)
- `maxPrice` - Maximum price filter (optional)
- `search` - Search in name and description (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "hasMore": true,
      "nextCursor": "base64_encoded_cursor",
      "limit": 10,
      "count": 10
    }
  }
}
```

#### Get Single Item
```http
GET /api/items/:id
Authorization: Bearer <token>
```

#### Create Item
```http
POST /api/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "category": "electronics",
  "price": 999.99,
  "stock": 50,
  "status": "active"
}
```

#### Update Item
```http
PUT /api/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 899.99,
  "stock": 45
}
```

#### Delete Item
```http
DELETE /api/items/:id
Authorization: Bearer <token>
```

#### Get Categories
```http
GET /api/items/categories
Authorization: Bearer <token>
```

## Cursor-Based Pagination

This API uses cursor-based pagination instead of offset-based pagination for better performance with large datasets.

### How It Works

1. **First Request**: Request items without a cursor
   ```
   GET /api/items?limit=10
   ```

2. **Subsequent Requests**: Use the `nextCursor` from the previous response
   ```
   GET /api/items?cursor=<nextCursor>&limit=10
   ```

3. **Benefits**:
   - Consistent results even when data changes
   - Better performance with large datasets
   - No memory issues with large collections
   - Efficient MongoDB queries using indexes

### Example Flow

```javascript
// First page
const response1 = await fetch('/api/items?limit=10', {
  headers: { 'Authorization': 'Bearer <token>' }
});
const { items, pagination } = await response1.json();
// pagination.nextCursor contains cursor for next page

// Second page
const response2 = await fetch(`/api/items?cursor=${pagination.nextCursor}&limit=10`, {
  headers: { 'Authorization': 'Bearer <token>' }
});
```

## Testing with Postman

1. **Import Collection** (create manually):
   - Register endpoint: `POST /api/auth/register`
   - Login endpoint: `POST /api/auth/login`
   - Get items: `GET /api/items`
   - Create item: `POST /api/items`

2. **Testing Flow**:
   - Register a new user
   - Login to get JWT token
   - Use token in Authorization header: `Bearer <token>`
   - Test item endpoints with various query parameters

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cursor_pagination_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

## Database Indexes

The Item model includes several indexes for optimal query performance:
- Single field indexes on `name`, `category`, `price`, `status`, `createdAt`
- Compound indexes for common query patterns

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Input validation

## Performance Considerations

- Cursor-based pagination prevents loading entire collections
- MongoDB indexes for fast queries
- Efficient sorting with compound indexes
- Lean queries for better memory usage

## License

MIT
