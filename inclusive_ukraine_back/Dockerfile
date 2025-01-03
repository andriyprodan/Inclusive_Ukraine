# Базовий образ
FROM python:3.10

# Робоча директорія
WORKDIR /app

# Копіювання залежностей
COPY requirements.txt /app/

# Створення віртуального середовища та встановлення залежностей
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --upgrade pip && \
    /opt/venv/bin/pip install -r requirements.txt

# Додавання віртуального середовища до PATH
ENV PATH="/opt/venv/bin:$PATH"

# Копіювання коду
COPY . /app/

# Експортування порту
EXPOSE 8000

# Запуск сервера
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
