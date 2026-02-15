@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🎰 Лотерея Донатов - Запуск
echo ========================================
echo.

REM Проверка наличия Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js не найден!
    echo.
    echo Пожалуйста, установите Node.js с https://nodejs.org
    echo Рекомендуемая версия: 18.x или выше
    echo.
    pause
    exit /b 1
)

REM Получение версии Node.js
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js найден: %NODE_VERSION%
echo.

REM Проверка наличия npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm не найден!
    echo.
    pause
    exit /b 1
)

REM Получение версии npm
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm найден: %NPM_VERSION%
echo.

REM Проверка наличия node_modules
if not exist "node_modules" (
    echo 📦 Папка node_modules не найдена
    echo 🔄 Устанавливаем зависимости...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ Ошибка установки зависимостей!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✅ Зависимости установлены успешно!
    echo.
) else (
    echo ✅ Зависимости уже установлены
    echo.
)

echo ========================================
echo 🚀 Запускаем сервер разработки...
echo ========================================
echo.
echo 📍 Приложение будет доступно по адресу:
echo    http://localhost:3000
echo.
echo 📝 Страницы:
echo    - Лотерея:  http://localhost:3000/
echo    - Админка:  http://localhost:3000/admin
echo.
echo 💡 Для остановки нажмите Ctrl+C
echo.
echo ========================================
echo.

REM Запуск dev сервера
call npm run dev

REM Если сервер завершился с ошибкой
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Сервер завершился с ошибкой!
    echo.
    pause
    exit /b 1
)