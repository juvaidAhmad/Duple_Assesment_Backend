# Backend API Documentation

## Architecture

The backend follows a clean MVC architecture with clear separation of concerns:

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Swagger)
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects (with pagination)
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Boards
- `GET /api/boards/project/:projectId` - Get boards by project
- `POST /api/boards` - Create board
- `GET /api/boards/:id` - Get board by ID
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks` - Get tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/reorder` - Reorder tasks
- `GET /api/tasks/board/:boardId` - Get tasks by board

### Comments
- `GET /api/comments/task/:taskId` - Get comments by task
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Users
- `GET /api/users/search?q=query` - Search users

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

## Database Schema

### User
- name, email, password (hashed)
- avatar, role (user/admin)
- isActive, timestamps

### Project
- name, description, owner
- members (array with user and role)
- status (active/archived/completed)
- color, timestamps

### Board
- name, description, project
- columns (array with name, order, color)
- isDefault, timestamps

### Task
- title, description, board, project
- status, priority, assignedTo, createdBy
- dueDate, order, tags
- attachments, activityHistory
- timestamps

### Comment
- content, task, author
- parentComment (for replies)
- isEdited, editedAt, timestamps

## Security Features

- JWT authentication with access/refresh tokens
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control
- Input validation with express-validator
- Rate limiting (can be added)
- Helmet for security headers
- CORS configuration

## Error Handling

Centralized error handling with custom AppError class:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

## Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for list endpoints
- Selective field population
- Text search indexing for tasks

## Testing

Run tests:
```bash
npm test
```

## Deployment

1. Set production environment variables
2. Use process manager (PM2):
```bash
npm install -g pm2
pm2 start src/server.js --name project-api
```

3. Configure reverse proxy (Nginx)
4. Enable SSL/TLS
5. Set up monitoring and logging
