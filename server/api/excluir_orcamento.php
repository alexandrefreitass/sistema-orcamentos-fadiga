<?php
include 'conexao.php';

$id = intval($_GET['id']);

$sql = "DELETE FROM orcamentos WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>