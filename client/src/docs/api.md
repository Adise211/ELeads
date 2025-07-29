# API Requests in the Frontend

## Proxy Configuration for API Calls

A proxy is set up in `vite.config.ts` to seamlessly forward frontend API requests to the backend server. This allows you to use relative paths like `/api/login` in your frontend code, which are automatically proxied to the backend (e.g., `localhost:8080/api/login`).  
**Example:**  
Frontend request: `localhost:5173/api/login`  
Proxied to backend: `localhost:8080/api/login`

---

## Making Requests: Fetch vs. Axios

### Using `fetch`

You can use the native `fetch` API for making HTTP requests. Thanks to the proxy, you don't need to specify the backend URL—just use the `/api/...` path.

### Using Axios

Axios is configured with global settings and interceptors in `services/httpConfig.ts`. This centralizes base URLs, headers, and error handling, so you don't need to repeat this logic in every request.

---

## Global HTTP Error Handling

All HTTP errors are handled globally in `services/httpConfig.ts`. You do **not** need to implement local error handling for each request—errors will be caught and processed by the global handler, ensuring consistent user feedback and logging throughout the app.
