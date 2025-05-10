
<?php
require_once 'config.php';

if ($_SERVER['REQUEST_URI'] === '/') {
    echo json_encode(['message' => 'API is running']);
    exit;
}

$routes = [
    '/api/clientes' => '/api/clientes.php',
    '/api/produtos' => '/api/produtos.php',
    '/api/orcamentos' => '/api/orcamentos.php'
];

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (isset($routes[$path])) {
    require_once __DIR__ . $routes[$path];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}
