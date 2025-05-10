<?php
include 'conexao.php';

$data = json_decode(file_get_contents("php://input"), true);

$clientId = intval($data['clientId']);
$laborCost = floatval($data['laborCost']);
$monthlyService = $conn->real_escape_string($data['monthlyService']);
$items = $conn->real_escape_string($data['items']);
$total = floatval($data['total']);

$sql = "INSERT INTO orcamentos (client_id, labor_cost, monthly_service, items, total) VALUES ('$clientId', '$laborCost', '$monthlyService', '$items', '$total')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>