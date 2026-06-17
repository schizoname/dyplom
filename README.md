# TextLink — перша фактична версія

У цій версії:

- прибрані демонстраційні вкладки перегляду та редагування;
- збережено початковий дизайн форми створення текстового блоку;
- додані сторінки реєстрації та входу;
- реалізовано REST API на Spring Boot;
- паролі зберігаються як BCrypt-хеші;
- авторизація працює через JWT у HttpOnly cookie — localStorage не використовується;
- користувачі зберігаються у PostgreSQL;
- додані Dockerfile та docker-compose.

## Швидкий запуск через Docker

```bash
docker compose up --build
```

Після запуску відкрийте:

```text
http://localhost:8080
```

## Запуск для розробки

### 1. PostgreSQL

Створіть БД `textlink` і користувача `textlink` або змініть параметри в
`backend/src/main/resources/application.yml`.

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`.

Vite автоматично проксіює `/api` на backend.

## REST API авторизації

- `POST /api/auth/register` — реєстрація;
- `POST /api/auth/login` — вхід;
- `POST /api/auth/logout` — вихід;
- `GET /api/auth/me` — поточний користувач.

### Реєстрація

```json
{
  "name": "Богдан",
  "email": "bohdan@example.com",
  "password": "strong-password"
}
```

### Вхід

```json
{
  "email": "bohdan@example.com",
  "password": "strong-password"
}
```

## Важливо

У production змініть `JWT_SECRET`, увімкніть HTTPS і встановіть
`COOKIE_SECURE=true`. Поточна версія реалізує саме реєстрацію та вхід;
REST API текстових блоків буде наступним етапом.
