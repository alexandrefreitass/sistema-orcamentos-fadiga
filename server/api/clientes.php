
<?php
require_once '../database.php';

$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $cliente = $db->query("SELECT * FROM clientes WHERE id = ?", [$_GET['id']]);
            echo json_encode($cliente ? $cliente[0] : null);
        } else {
            $clientes = $db->query("SELECT * FROM clientes");
            echo json_encode($clientes);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if(!isset($data['nome'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Nome é obrigatório']);
            break;
        }
        
        $result = $db->query(
            "INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)",
            [$data['nome'], $data['telefone'] ?? null, $data['email'] ?? null]
        );
        
        http_response_code(201);
        echo json_encode(['id' => $db->getConnection()->lastInsertId()]);
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $_GET['id'];
        
        $db->query(
            "UPDATE clientes SET nome = ?, telefone = ?, email = ? WHERE id = ?",
            [$data['nome'], $data['telefone'], $data['email'], $id]
        );
        
        echo json_encode(['message' => 'Cliente atualizado com sucesso']);
        break;
        
    case 'DELETE':
        $id = $_GET['id'];
        $db->query("DELETE FROM clientes WHERE id = ?", [$id]);
        echo json_encode(['message' => 'Cliente excluído com sucesso']);
        break;
}
