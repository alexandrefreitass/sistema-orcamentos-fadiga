<?php
include 'conexao.php';

$sql = "SELECT * FROM orcamentos";
$result = $conn->query($sql);

$orcamentos = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $orcamentos[] = $row;
    }
}

echo json_encode($orcamentos);
$conn->close();
?>