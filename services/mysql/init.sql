# Устанавливаем сравнение
ALTER DATABASE `linkdb` DEFAULT CHARSET=utf8 COLLATE utf8_unicode_ci;

# исправление метода авторизации
ALTER USER app IDENTIFIED with mysql_native_password BY 'apppassword';
