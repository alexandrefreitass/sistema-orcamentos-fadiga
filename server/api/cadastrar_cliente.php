<?php
include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

$nome = $conn->real_escape_string($data['nome']);
$telefone = $conn->real_escape_string($data['telefone']);
$email = $conn->real_escape_string($data['email']);

$sql = "INSERT INTO clientes (nome, telefone, email) VALUES ('$nome', '$telefone', '$email')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>