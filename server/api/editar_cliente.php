<?php
include 'conexao.php';

$id = intval($_GET['id']);
$data = json_decode(file_get_contents("php://input"), true);

$nome = $conn->real_escape_string($data['nome']);
$telefone = $conn->real_escape_string($data['telefone']);
$email = $conn->real_escape_string($data['email']);

$sql = "UPDATE clientes SET nome='$nome', telefone='$telefone', email='$email' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>