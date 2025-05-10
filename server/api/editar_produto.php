<?php
include 'conexao.php';

$id = intval($_GET['id']);
$data = json_decode(file_get_contents("php://input"), true);

$descricao = $conn->real_escape_string($data['descricao']);
$valor = $conn->real_escape_string($data['valor']);
$foto = $conn->real_escape_string($data['foto']);

$sql = "UPDATE produtos SET descricao='$descricao', valor='$valor', foto='$foto' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>