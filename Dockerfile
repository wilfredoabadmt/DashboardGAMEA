# Etapa 1: Construcción
FROM node:22-slim AS build
WORKDIR /app

# Copiamos solo los archivos de dependencias para aprovechar el caché de Docker
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y construimos el proyecto
COPY . .
RUN npm run build

# Etapa 2: Servidor de Producción (Nginx)
FROM nginx:alpine
# Vite genera la carpeta 'dist' por defecto
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración opcional para evitar errores 404 si usas React Router/Vue Router
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]