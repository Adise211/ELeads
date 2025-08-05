# Server Deployment Guide for Railway

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database. You can use:
   - Railway's PostgreSQL service
   - Supabase
   - PlanetScale
   - Any other PostgreSQL provider

2. **Environment Variables**: Set up the following environment variables in Railway:

### Required Environment Variables

| Variable                    | Description                       | Example                                         |
| --------------------------- | --------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string      | `postgresql://user:password@host:port/database` |
| `JWT_SECRET`                | Secret key for JWT signing        | `your-super-secret-jwt-key-here`                |
| `JWT_REFRESH_SECRET`        | Secret key for JWT refresh tokens | `your-super-secret-refresh-key-here`            |
| `FRONTEND_ORIGIN`           | CORS origin for your frontend     | `https://your-client-domain.railway.app`        |
| `COOKIE_ACCESS_TOKEN_NAME`  | Cookie name for access token      | `accessToken`                                   |
| `COOKIE_REFRESH_TOKEN_NAME` | Cookie name for refresh token     | `refreshToken`                                  |
| `JWT_EXPIRES_IN`            | JWT token expiration time         | `1h`                                            |
| `JWT_REFRESH_EXPIRES_IN`    | JWT refresh token expiration time | `7d`                                            |

### Optional Environment Variables

| Variable   | Description | Default      |
| ---------- | ----------- | ------------ |
| `PORT`     | Server port | `8080`       |
| `NODE_ENV` | Environment | `production` |

## Deployment Steps

1. **Create a new Railway project** for the server
2. **Connect your GitHub repository**
3. **Set the root directory** to `/` (root of the repository)
4. **Add environment variables** in Railway dashboard
5. **Deploy**

## Build Process

The build process will:

1. Install dependencies
2. Build the shared package
3. Build the server TypeScript code
4. Generate Prisma client

## Deployment Process

The deployment process will:

1. Run database migrations
2. Start the server

## Health Check

The server provides a health check endpoint at `/` that returns "ELeads API is running"

## API Endpoints

All API endpoints are prefixed with `/api`

## Troubleshooting

### Common Issues

1. **Database Connection**: Make sure `DATABASE_URL` is correctly set
2. **CORS Issues**: Update `FRONTEND_ORIGIN` to match your client domain
3. **JWT Issues**: Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
4. **Migration Failures**: Check database permissions and connection

### Logs

Check Railway logs for any build or runtime errors.
