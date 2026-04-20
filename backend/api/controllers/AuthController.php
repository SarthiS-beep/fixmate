<?php
class AuthController {
    public static function register($pdo, $data) {
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email, and password are required']);
            return;
        }

        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
            $stmt->execute([$data['name'], $data['email'], $hashed_password]);
            
            $userId = $pdo->lastInsertId();
            
            $stmt = $pdo->prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            http_response_code(201);
            echo json_encode(['message' => 'Registration successful', 'user' => $user]);
        } catch (\PDOException $e) {
            if ($e->getCode() == 23000) { // Integrity constraint violation (duplicate email)
                http_response_code(409);
                echo json_encode(['error' => 'Email address already registered']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to register account']);
            }
        }
    }

    public static function login($pdo, $data) {
        if (empty($data['email']) || empty($data['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }

        try {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
            $stmt->execute([$data['email']]);
            $user = $stmt->fetch();

            if (!$user) {
                // Auto-create account based on Python logic
                $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
                $parts = explode('@', $data['email']);
                $default_name = ucfirst($parts[0]);
                
                $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
                $stmt->execute([$default_name, $data['email'], $hashed_password]);
                $userId = $pdo->lastInsertId();
                
                http_response_code(201);
                echo json_encode([
                    'message' => 'Account automatically created and logged in!',
                    'user' => [
                        'id' => $userId,
                        'name' => $default_name,
                        'email' => $data['email']
                    ]
                ]);
                return;
            }

            if (password_verify($data['password'], $user['password_hash'])) {
                http_response_code(200);
                echo json_encode([
                    'message' => 'Login successful',
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid password']);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'An internal error occurred during login']);
        }
    }

    public static function socialLogin($pdo, $data) {
        $provider = $data['provider'] ?? 'Google';
        
        $email = $data['email'] ?? "demo_" . strtolower($provider) . "@example.com";
        $name = $data['name'] ?? "$provider Demo User";
        
        try {
            $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if (!$user) {
                $hashed_password = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
                $stmt = $pdo->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
                $stmt->execute([$name, $email, $hashed_password]);
                $userId = $pdo->lastInsertId();
            } else {
                $userId = $user['id'];
            }
            
            http_response_code(200);
            echo json_encode([
                'message' => "Successfully verified via $provider",
                'user' => [
                    'id' => $userId,
                    'name' => $name,
                    'email' => $email
                ]
            ]);
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
