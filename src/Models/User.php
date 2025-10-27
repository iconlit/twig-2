<?php

class User {
    private static $dataFile = __DIR__ . '/../../data/users.json';

    public static function init() {
        if (!file_exists(self::$dataFile)) {
            $initialUsers = [
                [
                    'id' => '1',
                    'email' => 'test@example.com',
                    'passwordHash' => password_hash('password123', PASSWORD_DEFAULT)
                ]
            ];
            file_put_contents(self::$dataFile, json_encode($initialUsers, JSON_PRETTY_PRINT));
        }
    }

    private static function getUsers() {
        self::init();
        $data = file_get_contents(self::$dataFile);
        return json_decode($data, true);
    }

    private static function saveUsers($users) {
        file_put_contents(self::$dataFile, json_encode($users, JSON_PRETTY_PRINT));
    }

    public static function findByEmail($email) {
        $users = self::getUsers();
        foreach ($users as $user) {
            if ($user['email'] === $email) {
                return $user;
            }
        }
        return null;
    }

    public static function findById($id) {
        $users = self::getUsers();
        foreach ($users as $user) {
            if ($user['id'] === $id) {
                return $user;
            }
        }
        return null;
    }

    public static function create($email, $password) {
        $users = self::getUsers();
        
        if (self::findByEmail($email)) {
            throw new Exception('User with this email already exists.');
        }

        $newUser = [
            'id' => (string)time(),
            'email' => $email,
            'passwordHash' => password_hash($password, PASSWORD_DEFAULT)
        ];

        $users[] = $newUser;
        self::saveUsers($users);

        return [
            'id' => $newUser['id'],
            'email' => $newUser['email']
        ];
    }

    public static function verify($email, $password) {
        $user = self::findByEmail($email);
        
        if (!$user || !password_verify($password, $user['passwordHash'])) {
            return false;
        }

        return [
            'id' => $user['id'],
            'email' => $user['email']
        ];
    }
}
