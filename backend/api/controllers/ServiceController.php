<?php
class ServiceController {
    public static function getServices($pdo) {
        try {
            $stmt = $pdo->query('SELECT * FROM services');
            $services = $stmt->fetchAll();
            
            http_response_code(200);
            echo json_encode($services);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
