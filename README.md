# 1 Percent - Backend API

## Features

### User Management
- User registration and authentication
- Profile management
- Session handling
- Role-based access control (User/Admin)

### Post Management
- Create, read, update, and delete posts
- Topic-based post organization
- Like/unlike functionality
- Comment system
- Cascading deletions for related content

### Social Features
- Follow/unfollow system
- Profile viewing
- User statistics

## Tech Stack
- Node.js
- Express.js
- PostgreSQL
- CORS
- dotenv

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/osamahussein-dev/1-percent-api]
cd 1-percent-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user (Default: postgres)
DB_PASSWORD=your_database_password (Default: 0000)
DB_DATABASE=1-percent-api
```

4. Set up the database:
- Create a PostgreSQL database
- Run the SQL commands from `db.sql` to set up the schema or you can run it manually using query tools

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/password` - Update password

### Posts
- `POST /posts` - Create new post
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get specific post
- `DELETE /posts/:id` - Delete post
- `GET /posts/topic/:topic` - Get posts by topic

### Comments
- `POST /comments` - Add comment
- `GET /comments/:postId` - Get post comments
- `DELETE /comments/:id` - Delete comment

### Likes
- `POST /like/:postId` - Like post
- `DELETE /like/:postId` - Unlike post

### Topics
- `GET /topics` - Get all topics
- `GET /topics/:id/posts` - Get posts by topic

### Follow
- `POST /follow/:userId` - Follow user
- `DELETE /follow/:userId` - Unfollow user
- `GET /follow/:userId/followers` - Get user followers
- `GET /follow/:userId/following` - Get user following

## Database Schema

The database includes the following tables:
- users
- posts
- comments
- likes
- topics
- follows
- user_details

Refer to `db.sql` for the complete schema definition.

## Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Error Handling
The API implements standardized error responses:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error