# Базовий образ
FROM node:20

# Робоча директорія
WORKDIR /app

# Копіювання package.json і yarn.lock
COPY package.json yarn.lock /app/

# Встановлення залежностей
RUN yarn install

# Копіювання коду
COPY . /app/

# Побудова проекту
RUN yarn build

# Експортування порту
EXPOSE 3000

# Запуск додатку
CMD ["yarn", "start"]
