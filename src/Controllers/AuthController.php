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
            'error' => Session::getFlash('error'),
            'csrf_token' => Session::generateCsrfToken()
        ]);
    }

    public function login() {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::validateCsrfToken($csrfToken)) {
            Session::setFlash('error', 'Invalid request. Please try again.');
            header('Location: /login');
            exit;
        }

        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $user = User::verify($email, $password);
            
            if (!$user) {
                Session::setFlash('error', 'Invalid email or password.');
                header('Location: /login');
                exit;
            }

            Session::regenerate();
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
            'error' => Session::getFlash('error'),
            'csrf_token' => Session::generateCsrfToken()
        ]);
    }

    public function signup() {
        $csrfToken = $_POST['csrf_token'] ?? '';
        if (!Session::validateCsrfToken($csrfToken)) {
            Session::setFlash('error', 'Invalid request. Please try again.');
            header('Location: /signup');
            exit;
        }

        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $user = User::create($email, $password);
            Session::regenerate();
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
        Session::regenerate();
        Session::destroy();
        header('Location: /');
        exit;
    }
}
