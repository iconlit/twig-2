<?php

class Router {
    private $routes = [];
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function get($path, $callback) {
        $this->routes['GET'][$path] = $callback;
    }

    public function post($path, $callback) {
        $this->routes['POST'][$path] = $callback;
    }

    public function dispatch($method, $path) {
        if (isset($this->routes[$method][$path])) {
            $callback = $this->routes[$method][$path];
            call_user_func($callback);
        } else {
            http_response_code(404);
            echo $this->twig->render('404.twig');
        }
    }
}
