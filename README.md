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
#### Register New User
```http
POST /auth/register

{
  "name": "Osama Hussein",
  "email": "osama@gmail.com",
  "password": "securePassword123",
  "phone": "1234567890"
}

{
  "id": 1,
  "name": "Osama Hussein",
  "email": "osama@gmail.com"
}
```

#### User Login
```http
POST /auth/login

{
  "email": "osama@gmail.com",
  "password": "securePassword123"
}

{
  "id": 1,
  "name": "Osama Hussein",
  "email": "osama@gmail.com",
  "token": "user_auth_token"
}
```

### Users
#### Get User Profile
```http
GET /users/1

{
  "id": 1,
  "name": "Osama Hussein",
  "email": "osama@gmail.com",
  "phone": "1234567890",
  "posts_count": 10,
  "followers_count": 50,
  "following_count": 30
}
```

#### Update User Profile
```http
PUT /users/1

{
  "name": "Osama Hussein",
  "email": "osama.hussein@gmail.com",
  "phone": "0987654321"
}

{
  "id": 1,
  "name": "Osama Hussein",
  "email": "osama.hussein@gmail.com",
  "phone": "0987654321"
}
```

#### Update Password
```http
PUT /users/1/password

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}

{
  "message": "Password updated successfully"
}
```

### Posts
#### Create New Post
```http
POST /posts

{
  "title": "My First Post",
  "content": "This is my first post about programming",
  "topics": ["technology", "programming"]
}

{
  "id": 1,
  "title": "My First Post",
  "content": "This is my first post about programming",
  "topics": ["technology", "programming"],
  "created_at": "2024-03-20T10:00:00Z",
  "author": {
    "id": 1,
    "name": "Osama Hussein"
  }
}
```

#### Get All Posts
```http
GET /posts

{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is my first post about programming",
      "topics": ["technology", "programming"],
      "created_at": "2024-03-20T10:00:00Z",
      "author": {
        "id": 1,
        "name": "Osama Hussein"
      },
      "likes_count": 5,
      "comments_count": 2
    }
  ]
}
```

#### Get Posts by Topic
```http
GET /posts/topic/technology

{
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is my first post about programming",
      "topics": ["technology", "programming"],
      "created_at": "2024-03-20T10:00:00Z",
      "author": {
        "id": 1,
        "name": "Osama Hussein"
      }
    }
  ]
}
```

### Comments
#### Add Comment
```http
POST /comments

{
  "post_id": 1,
  "content": "Great post about programming!"
}

{
  "id": 1,
  "content": "Great post about programming!",
  "user_id": 1,
  "user_name": "Osama Hussein",
  "post_id": 1,
  "created_at": "2024-03-20T11:00:00Z"
}
```

#### Get Post Comments
```http
GET /comments/1

{
  "comments": [
    {
      "id": 1,
      "content": "Great post about programming!",
      "user": {
        "id": 1,
        "name": "Osama Hussein"
      },
      "created_at": "2024-03-20T11:00:00Z"
    }
  ]
}
```

### Likes
#### Like Post
```http
POST /like/1

{
  "message": "Post liked successfully",
  "likes_count": 6,
  "liked_by": {
    "id": 1,
    "name": "Osama Hussein"
  }
}
```

#### Unlike Post
```http
DELETE /like/1

{
  "message": "Post unliked successfully",
  "likes_count": 5,
  "unliked_by": {
    "id": 1,
    "name": "Osama Hussein"
  }
}
```

### Topics
#### Get All Topics
```http
GET /topics

{
  "topics": [
    {
      "id": 1,
      "name": "technology",
      "posts_count": 15
    },
    {
      "id": 2,
      "name": "programming",
      "posts_count": 10
    }
  ]
}
```

#### Get Posts by Topic
```http
GET /topics/1/posts

{
  "topic": "technology",
  "posts": [
    {
      "id": 1,
      "title": "My First Post",
      "content": "This is my first post about programming",
      "created_at": "2024-03-20T10:00:00Z",
      "author": {
        "id": 1,
        "name": "Osama Hussein"
      }
    }
  ]
}
```

### Follow
#### Follow User
```http
POST /follow/2

{
  "message": "Successfully followed user",
  "follower": {
    "id": 1,
    "name": "Osama Hussein"
  },
  "followers_count": 51
}
```

#### Unfollow User
```http
DELETE /follow/2

{
  "message": "Successfully unfollowed user",
  "unfollower": {
    "id": 1,
    "name": "Osama Hussein"
  },
  "followers_count": 50
}
```

#### Get User Followers
```http
GET /follow/1/followers

{
  "user": {
    "id": 1,
    "name": "Osama Hussein"
  },
  "followers": [
    {
      "id": 2,
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  ]
}
```

#### Get User Following
```http
GET /follow/1/following

{
  "user": {
    "id": 1,
    "name": "Osama Hussein"
  },
  "following": [
    {
      "id": 3,
      "name": "Bob Smith",
      "email": "bob@example.com"
    }
  ]
}
```

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