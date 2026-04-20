<?php
class SettingsController {
    public static function updateSettings($pdo, $data) {
        if (empty($data['id']) || empty($data['name']) || empty($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'ID, Name, and email are required']);
            return;
        }

        try {
            if (!empty($data['password'])) {
                // Update with password
                $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
                $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?');
                $stmt->execute([$data['name'], $data['email'], $hashed_password, $data['id']]);
            } else {
                // Update without password
                $stmt = $pdo->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
                $stmt->execute([$data['name'], $data['email'], $data['id']]);
            }
            
            // Fetch updated record
            $stmt = $pdo->prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
            $stmt->execute([$data['id']]);
            $user = $stmt->fetch();
            
            http_response_code(200);
            echo json_encode(['message' => 'Settings updated successfully', 'user' => $user]);
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) {
                http_response_code(409);
                echo json_encode(['error' => 'Email address already in use by another account']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to update settings']);
            }
        }
    }
}
