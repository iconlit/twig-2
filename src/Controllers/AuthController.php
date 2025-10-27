<?php

class AuthController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function showLogin() {
        if (Session::get('user')) {
            header('Location: /dashboard');
            exit;
        }
        
        echo $this->twig->render('pages/login.twig', [
            'error' => Session::getFlash('error')
        ]);
    }

    public function login() {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $user = User::verify($email, $password);
            
            if (!$user) {
                Session::setFlash('error', 'Invalid email or password.');
                header('Location: /login');
                exit;
            }

            Session::set('user', $user);
            Session::setFlash('success', 'Welcome back!');
            header('Location: /dashboard');
            exit;
        } catch (Exception $e) {
            Session::setFlash('error', $e->getMessage());
            header('Location: /login');
            exit;
        }
    }

    public function showSignup() {
        if (Session::get('user')) {
            header('Location: /dashboard');
            exit;
        }
        
        echo $this->twig->render('pages/signup.twig', [
            'error' => Session::getFlash('error')
        ]);
    }

    public function signup() {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $user = User::create($email, $password);
            Session::set('user', $user);
            Session::setFlash('success', 'Account created successfully!');
            header('Location: /dashboard');
            exit;
        } catch (Exception $e) {
            Session::setFlash('error', $e->getMessage());
            header('Location: /signup');
            exit;
        }
    }

    public function logout() {
        Session::delete('user');
        Session::destroy();
        header('Location: /');
        exit;
    }
}
