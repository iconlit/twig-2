<?php

class TicketController {
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
        
        usort($tickets, function($a, $b) {
            return strtotime($b['updatedAt']) - strtotime($a['updatedAt']);
        });

        echo $this->twig->render('pages/tickets.twig', [
            'tickets' => $tickets,
            'success' => Session::getFlash('success'),
            'error' => Session::getFlash('error')
        ]);
    }

    public function create() {
        if (!Session::get('user')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            $data = [
                'title' => $_POST['title'] ?? '',
                'description' => $_POST['description'] ?? '',
                'status' => $_POST['status'] ?? Ticket::STATUS_OPEN
            ];

            $ticket = Ticket::create($data);
            echo json_encode(['success' => true, 'ticket' => $ticket]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function update() {
        if (!Session::get('user')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            $id = $_POST['id'] ?? '';
            $data = [
                'title' => $_POST['title'] ?? null,
                'description' => $_POST['description'] ?? null,
                'status' => $_POST['status'] ?? null
            ];

            $data = array_filter($data, function($value) {
                return $value !== null;
            });

            $ticket = Ticket::update($id, $data);
            echo json_encode(['success' => true, 'ticket' => $ticket]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function delete() {
        if (!Session::get('user')) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            exit;
        }

        try {
            $id = $_POST['id'] ?? '';
            Ticket::delete($id);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
