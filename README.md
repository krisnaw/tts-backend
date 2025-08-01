## TODO FEATURE
- [✅] Create/Register user Route
- [✅] Login user Route
- [✅] API documentation
- [✅] JWT Auth
- [✅] Create Record route: Store users’ conversion settings in a database.
- [✅] Remove Record Route
- [✅] Select / GET record by User ID route: Retrieve users’ conversion history
- [✅] Select / GET record by ID

# Explanation and Trade-off

#### Hono.js: I use hono because folowing reason
- I use Hono.js because it is an ultrafast and lightweight framework for building web services.
- It has many built-in features for creating APIs, such as CORS, JWT authentication, and middleware.
- It has excellent integration with third-party modules like Zod and OpenAPI specs, which enables type safety and API documentation.
- It can be deployed everywhere.
 

# TTS API

This is a Text-to-Speech API built with Hono, Drizzle ORM, and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from the `.env.example` file and fill in the required environment variables.
    ```bash
    cp .env.example .env
    ```
### Environment Variables

The following environment variables are required:

-   `DATABASE_URL`: The connection string for your Neon PostgreSQL database.

### Running the application

```bash
npm run dev
```

The application will be running at `http://localhost:3000`.

### Database Migrations

When you change the database schema, you need to generate a new migration file and apply it to the database.

**Generate a new migration:**

```bash
npm run db:generate
```

This will create a new SQL migration file in the `src/db/migrations` directory.

**Apply migrations:**

```bash
npm run db:migrate
```

This will apply any pending migrations to the database.

## API Documentation

The API documentation is available at the following endpoints:

| Method | Path          | Description                   |
| :------- | :------------ | :---------------------------- |
| `GET`    | `/doc`        | OpenAPI specification (JSON)  |
| `GET`    | `/reference`  | Scalar API Reference          |


## API Endpoints

### Index

| Method | Path | Description     |
| :----- | :--- | :-------------- |
| `GET`  | `/`  | Returns a welcome message |

### Auth

| Method | Path       | Description      |
| :----- | :--------- | :--------------- |
| `GET`  | `/users`   | Lists all users  |
| `POST` | `/register`| Registers a new user |
| `POST` | `/login`   | Logs in a user   |

### Records

| Method   | Path          | Description                   |
| :------- | :------------ | :---------------------------- |
| `GET`    | `/records`    | Lists all records             |
| `GET`    | `/records/{id}` | Gets records by user ID       |
| `POST`   | `/records`    | Creates a new record          |
| `DELETE` | `/records/{id}` | Deletes a record by its ID    |

## Directory Structure

```
src/
├───app.ts
├───index.ts
├───db/
│   ├───index.ts
│   ├───schema.ts
│   └───migrations/
│       ├───...
│       └───meta/
│           └───...
├───lib/
│   ├───configure-open-api.ts
│   ├───constants.ts
│   ├───create-app.ts
│   └───types.ts
├───middlewares/
│   └───pino-loggers.ts
└───routes/
    ├───index.route.ts
    ├───auth/
    │   ├───auth.handlers.ts
    │   ├───auth.index.ts
    │   └───auth.routes.ts
    └───records/
        ├───records.handlers.ts
        ├───records.index.ts
        └───records.routes.ts
```