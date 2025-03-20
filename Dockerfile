# Image tanlash
FROM node:18-alpine

# Ishchi katalog yaratish
WORKDIR /app

# Fayllarni nusxalash
COPY package*.json ./

# Paklarni o'rnatish
RUN npm install --legacy-peer-deps

# Loyihani nusxalash
COPY . .

# Loyihani qurish
RUN npm run build

# Portni ochish
EXPOSE 3000

# Loyihani ishga tushirish
CMD ["npm", "run", "start:dev"]
