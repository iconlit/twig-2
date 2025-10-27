<?php

class Ticket {
    private static $dataFile = __DIR__ . '/../../data/tickets.json';

    const STATUS_OPEN = 'open';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_CLOSED = 'closed';

    public static function init() {
        if (!file_exists(self::$dataFile)) {
            file_put_contents(self::$dataFile, json_encode([], JSON_PRETTY_PRINT));
        }
    }

    private static function getTickets() {
        self::init();
        $data = file_get_contents(self::$dataFile);
        return json_decode($data, true) ?? [];
    }

    private static function saveTickets($tickets) {
        file_put_contents(self::$dataFile, json_encode($tickets, JSON_PRETTY_PRINT));
    }

    public static function all() {
        return self::getTickets();
    }

    public static function create($data) {
        $tickets = self::getTickets();
        
        $newTicket = [
            'id' => (string)(time() . rand(1000, 9999)),
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'status' => $data['status'] ?? self::STATUS_OPEN,
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];

        $tickets[] = $newTicket;
        self::saveTickets($tickets);

        return $newTicket;
    }

    public static function update($id, $data) {
        $tickets = self::getTickets();
        
        foreach ($tickets as &$ticket) {
            if ($ticket['id'] === $id) {
                if (isset($data['title'])) $ticket['title'] = $data['title'];
                if (isset($data['description'])) $ticket['description'] = $data['description'];
                if (isset($data['status'])) $ticket['status'] = $data['status'];
                $ticket['updatedAt'] = date('c');
                
                self::saveTickets($tickets);
                return $ticket;
            }
        }

        throw new Exception('Ticket not found');
    }

    public static function delete($id) {
        $tickets = self::getTickets();
        $newTickets = array_filter($tickets, function($ticket) use ($id) {
            return $ticket['id'] !== $id;
        });

        if (count($tickets) === count($newTickets)) {
            throw new Exception('Ticket not found');
        }

        self::saveTickets(array_values($newTickets));
        return true;
    }

    public static function getStats() {
        $tickets = self::getTickets();
        $stats = [
            'total' => count($tickets),
            'open' => 0,
            'inProgress' => 0,
            'closed' => 0
        ];

        foreach ($tickets as $ticket) {
            if ($ticket['status'] === self::STATUS_OPEN) {
                $stats['open']++;
            } elseif ($ticket['status'] === self::STATUS_IN_PROGRESS) {
                $stats['inProgress']++;
            } elseif ($ticket['status'] === self::STATUS_CLOSED) {
                $stats['closed']++;
            }
        }

        return $stats;
    }
}
