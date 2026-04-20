<?php
class BookingController {
    public static function getBookings($pdo) {
        try {
            $stmt = $pdo->query('SELECT * FROM bookings ORDER BY created_at DESC');
            $bookings = $stmt->fetchAll();
            
            http_response_code(200);
            echo json_encode($bookings);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function createBooking($pdo, $data) {
        $required_fields = ['full_name', 'phone_number', 'full_address', 'preferred_date', 'preferred_time', 'payment_option'];
        
        foreach ($required_fields as $field) {
            if (empty($data[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing or empty required field: $field"]);
                return;
            }
        }

        // Time validation (9 AM to 9 PM)
        $time_str = $data['preferred_time'];
        $parts = explode(':', $time_str);
        if (count($parts) >= 2) {
            $hours = (int)$parts[0];
            $minutes = (int)$parts[1];
            if ($hours < 9 || $hours > 21 || ($hours == 21 && $minutes > 0)) {
                http_response_code(400);
                echo json_encode(['error' => 'Time must be between 9:00 AM and 9:00 PM']);
                return;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid time format']);
            return;
        }

        $service_category = $data['service_category'] ?? 'General';

        $provider_id = null;
        $provider_name = null;

        try {
            $stmt = $pdo->prepare('SELECT * FROM service_providers WHERE category = ? AND is_available = 1 LIMIT 1');
            $stmt->execute([$service_category]);
            $provider = $stmt->fetch();

            if ($provider) {
                $provider_id = $provider['id'];
                $provider_name = $provider['name'];
                
                // Simulate notification
                error_log("NOTIFICATION SENT TO SERVICE PROVIDER: {$provider_name}");
            }

            $stmt = $pdo->prepare('
                INSERT INTO bookings (full_name, phone_number, full_address, preferred_date, preferred_time, payment_option, service_category, provider_id, provider_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            
            $stmt->execute([
                $data['full_name'],
                $data['phone_number'],
                $data['full_address'],
                $data['preferred_date'],
                $data['preferred_time'],
                $data['payment_option'],
                $service_category,
                $provider_id,
                $provider_name
            ]);
            
            $inserted_id = $pdo->lastInsertId();
            
            $stmt = $pdo->prepare('SELECT * FROM bookings WHERE id = ?');
            $stmt->execute([$inserted_id]);
            $booking_record = $stmt->fetch();
            
            http_response_code(201);
            echo json_encode(['message' => 'Booking successful!', 'booking' => $booking_record]);
            
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
