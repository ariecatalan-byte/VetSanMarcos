/** URL base de la API REST (Spring Boot). Se puede cambiar con VITE_API_URL en un archivo .env */
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1").replace(/\/$/, "");
