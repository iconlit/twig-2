<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/Session.php';
require_once __DIR__ . '/../src/Controllers/HomeController.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/DashboardController.php';
require_once __DIR__ . '/../src/Controllers/TicketController.php';
require_once __DIR__ . '/../src/Models/User.php';
require_once __DIR__ . '/../src/Models/Ticket.php';

Session::start();

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../src/Views');
$twig = new \Twig\Environment($loader, [
    'cache' => false,
    'debug' => true,
]);

$twig->addGlobal('isAuthenticated', Session::get('user') !== null);
$twig->addGlobal('user', Session::get('user'));

$router = new Router($twig);

$router->get('/', [new HomeController($twig), 'index']);
$router->get('/login', [new AuthController($twig), 'showLogin']);
$router->post('/login', [new AuthController($twig), 'login']);
$router->get('/signup', [new AuthController($twig), 'showSignup']);
$router->post('/signup', [new AuthController($twig), 'signup']);
$router->get('/logout', [new AuthController($twig), 'logout']);

$router->get('/dashboard', [new DashboardController($twig), 'index']);
$router->get('/tickets', [new TicketController($twig), 'index']);
$router->post('/tickets/create', [new TicketController($twig), 'create']);
$router->post('/tickets/update', [new TicketController($twig), 'update']);
$router->post('/tickets/delete', [new TicketController($twig), 'delete']);

$router->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
