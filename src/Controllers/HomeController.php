<?php

class HomeController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        if (Session::get('user')) {
            header('Location: /dashboard');
            exit;
        }
        echo $this->twig->render('pages/landing.twig');
    }
}
