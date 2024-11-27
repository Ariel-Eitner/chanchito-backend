# Usa una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación NestJS
RUN npm run build

# Exponer el puerto en el que la aplicación corre
EXPOSE 3600

# Comando para correr la aplicación
CMD ["npm", "run", "start:prod"]
