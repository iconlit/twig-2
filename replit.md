# TicketApp - PHP with Twig

## Overview
A modern ticket management system built with PHP and Twig templating engine. This application allows users to create accounts, manage support tickets, and track their progress through an intuitive dashboard.

## Recent Changes
- **October 27, 2025**: Converted from React/TypeScript application to PHP with Twig templates
  - Migrated all React components to Twig templates
  - Implemented PHP backend with routing, authentication, and ticket management
  - Set up session-based authentication
  - Configured JSON file storage for users and tickets
  - Deployed on PHP built-in server (port 5000)

## Tech Stack
- **Backend**: PHP 8.4
- **Templating**: Twig 3.x
- **Styling**: Tailwind CSS (CDN)
- **Data Storage**: JSON files (data/users.json, data/tickets.json)
- **Server**: PHP built-in development server

## Project Structure
```
.
├── public/
│   └── index.php          # Application entry point
├── src/
│   ├── Controllers/       # Route handlers
│   │   ├── AuthController.php
│   │   ├── DashboardController.php
│   │   ├── HomeController.php
│   │   └── TicketController.php
│   ├── Models/            # Data models
│   │   ├── User.php
│   │   └── Ticket.php
│   ├── Views/             # Twig templates
│   │   ├── components/    # Reusable components
│   │   ├── layout/        # Base layouts
│   │   └── pages/         # Page templates
│   ├── Router.php         # Simple routing system
│   └── Session.php        # Session management
├── data/                  # JSON data storage
│   ├── users.json
│   └── tickets.json
└── vendor/                # Composer dependencies

```

## Features
- **User Authentication**: Sign up, login, logout with password hashing
- **Security**: CSRF protection, session regeneration, secure cookie flags
- **Ticket Management**: Create, read, update, delete (CRUD) operations
- **Dashboard**: View statistics and recent activity
- **Status Tracking**: Track tickets through Open, In Progress, and Closed states
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Development
The application runs on PHP's built-in server on port 5000:
```bash
php -S 0.0.0.0:5000 -t public
```

## Default User
- Email: test@example.com
- Password: password123

## Deployment
Configured for VM deployment to maintain session state and support PHP sessions properly.
