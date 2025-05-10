<?php
include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

$descricao = $conn->real_escape_string($data['descricao']);
$valor = $conn->real_escape_string($data['valor']);
$foto = $conn->real_escape_string($data['foto']);

$sql = "INSERT INTO produtos (descricao, valor, foto) VALUES ('$descricao', '$valor', '$foto')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>