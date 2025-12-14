# 🔥 Налаштування Firebase

Покрокова інструкція для налаштування Firebase Realtime Database для проекту "Пінг-Понг з Друзями".

## 1. Створення Firebase проекту

1. Перейдіть на [Firebase Console](https://console.firebase.google.com/)
2. Натисніть **"Add project"** (Створити проект)
3. Введіть назву проекту (наприклад, "ping-pong-app")
4. (Опціонально) Відключіть Google Analytics якщо не потрібно
5. Натисніть **"Create project"**

## 2. Додавання Web App

1. У консолі Firebase оберіть ваш проект
2. Натисніть на іконку **`</>`** (Web) для додавання веб-додатку
3. Введіть назву додатку (наприклад, "Ping Pong Web")
4. **НЕ** вмикайте Firebase Hosting (якщо використовуєте Vercel)
5. Натисніть **"Register app"**

## 3. Копіювання конфігурації

Після реєстрації додатку ви побачите конфігураційний об'єкт:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Скопіюйте ці значення та додайте їх у файл `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## 4. Увімкнення Realtime Database

1. У лівій панелі оберіть **"Build"** → **"Realtime Database"**
2. Натисніть **"Create Database"**
3. Оберіть локацію сервера (наприклад, `europe-west1` для Європи)
4. Оберіть **"Start in test mode"** для розробки
5. Натисніть **"Enable"**

⚠️ **Важливо:** Test mode дозволяє будь-кому читати та писати дані. Це підходить тільки для розробки!

## 5. Налаштування Security Rules (для розробки)

У розділі **"Rules"** ви побачите базові правила:

```json
{
  "rules": {
    ".read": "now < 1234567890000",
    ".write": "now < 1234567890000"
  }
}
```

Замініть їх на:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Натисніть **"Publish"**.

## 6. Security Rules для продакшену

Для продакшену використовуйте валідацію даних:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['code', 'status', 'createdAt', 'hostId', 'players', 'teams', 'queue', 'bench', 'votes'])",

        "code": {
          ".validate": "newData.isString() && newData.val().matches(/^PING-[0-9]{4}$/)"
        },

        "status": {
          ".validate": "newData.isString() && (newData.val() === 'lobby' || newData.val() === 'playing')"
        },

        "createdAt": {
          ".validate": "newData.isNumber()"
        },

        "hostId": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },

        "players": {
          "$playerId": {
            ".validate": "newData.hasChildren(['id', 'name', 'joinedAt', 'gamesPlayed', 'satOutLast', 'wins', 'losses'])",
            "name": {
              ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 20"
            },
            "gamesPlayed": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            },
            "wins": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            },
            "losses": {
              ".validate": "newData.isNumber() && newData.val() >= 0"
            }
          }
        },

        "teams": {
          "$teamId": {
            ".validate": "newData.hasChildren(['id', 'player1Id', 'player2Id'])"
          }
        },

        "queue": {
          ".validate": "newData.val() === null || newData.hasChildren()"
        },

        "bench": {
          ".validate": "newData.val() === null || newData.hasChildren()"
        },

        "votes": {
          ".validate": "newData.hasChildren(['pendingResult', 'voters', 'startedAt'])"
        }
      }
    }
  }
}
```

## 7. Перевірка підключення

Після налаштування Firebase та `.env.local`:

1. Перезапустіть dev сервер:
   ```bash
   npm run dev
   ```

2. Відкрийте [http://localhost:3000](http://localhost:3000)

3. Створіть кімнату

4. Перевірте в Firebase Console → Realtime Database, чи з'явились дані:
   ```
   rooms/
     PING-XXXX/
       code: "PING-XXXX"
       status: "lobby"
       ...
   ```

## 8. Troubleshooting

### Помилка: "Permission denied"

- Перевірте Security Rules - для розробки має бути `".read": true, ".write": true`
- Переконайтесь, що DATABASE_URL правильний

### Помилка: "Database URL not found"

- Переконайтесь, що `NEXT_PUBLIC_FIREBASE_DATABASE_URL` встановлено в `.env.local`
- URL має бути у форматі: `https://your-project.firebaseio.com`

### Дані не оновлюються в реал-таймі

- Перезавантажте сторінку
- Перевірте консоль браузера на помилки
- Перевірте, чи Firebase Realtime Database увімкнено

### Помилка при білді

- Переконайтесь що всі env змінні мають префікс `NEXT_PUBLIC_`
- Перезапустіть dev сервер після зміни `.env.local`

## 9. Deployment на Vercel

При деплої на Vercel додайте environment variables:

1. Перейдіть у налаштування проекту на Vercel
2. Оберіть **"Environment Variables"**
3. Додайте всі змінні з `.env.local`
4. Redeploy проект

## 10. Моніторинг та обмеження

Firebase має безкоштовний план Spark з обмеженнями:
- **Realtime Database**: 1 GB зберігання, 10 GB/місяць трафік
- Для MVP цього більш ніж достатньо

Якщо потрібно більше - перейдіть на план Blaze (pay-as-you-go).

## Готово! 🎉

Тепер ваш проект підключено до Firebase Realtime Database і готовий до використання!
