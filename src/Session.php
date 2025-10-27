<?php

class Session {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            ini_set('session.cookie_samesite', 'Strict');
            if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
                ini_set('session.cookie_secure', 1);
            }
            session_start();
        }
    }

    public static function regenerate() {
        session_regenerate_id(true);
    }

    public static function get($key, $default = null) {
        return $_SESSION[$key] ?? $default;
    }

    public static function set($key, $value) {
        $_SESSION[$key] = $value;
    }

    public static function delete($key) {
        unset($_SESSION[$key]);
    }

    public static function destroy() {
        session_destroy();
    }

    public static function getFlash($key) {
        $value = self::get($key);
        self::delete($key);
        return $value;
    }

    public static function setFlash($key, $value) {
        self::set($key, $value);
    }

    public static function generateCsrfToken() {
        if (!self::get('csrf_token')) {
            self::set('csrf_token', bin2hex(random_bytes(32)));
        }
        return self::get('csrf_token');
    }

    public static function validateCsrfToken($token) {
        return hash_equals(self::get('csrf_token', ''), $token);
    }
}
