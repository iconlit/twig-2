<?php

class DashboardController {
    private $twig;

    public function __construct($twig) {
        $this->twig = $twig;
    }

    public function index() {
        $user = Session::get('user');
        
        if (!$user) {
            header('Location: /login');
            exit;
        }

        $tickets = Ticket::all();
        $stats = Ticket::getStats();
        
        usort($tickets, function($a, $b) {
            return strtotime($b['updatedAt']) - strtotime($a['updatedAt']);
        });
        
        $recentTickets = array_slice($tickets, 0, 5);

        echo $this->twig->render('pages/dashboard.twig', [
            'stats' => $stats,
            'recentTickets' => $recentTickets,
            'success' => Session::getFlash('success')
        ]);
    }
}
