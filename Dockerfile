# используем официальный образ Node.js в качестве базового образа
FROM node:current-slim

# создаем директорию приложения в контейнере
WORKDIR /app

# копируем файл package.json в контейнер
COPY package*.json ./

# устанавливаем зависимости
RUN yarn install --frozen-lockfile

# копируем все файлы проекта в контейнер
COPY . .

ENV PORT=3000

EXPOSE $PORT

# запускаем приложение
CMD [ "yarn", "start" ]