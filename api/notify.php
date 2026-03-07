<?php
// CORS headers – same pattern as storage.php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$scheme = ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http');
$sameOrigin = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
$isLocalDev = (bool) preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin);

if ($origin !== '' && ($origin === $sameOrigin || $isLocalDev)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = file_get_contents('php://input');
if ($body === false || $body === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Empty body']);
    exit;
}

$devis = json_decode($body, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($devis)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$config = require __DIR__ . '/config.php';
$adminEmail = filter_var($config['admin_email'], FILTER_VALIDATE_EMAIL) ?: 'contact@leparadise77.fr';
$siteName = preg_replace('/[\r\n]/', '', $config['site_name']);
$siteUrl = $config['site_url'];

$clientPrenom  = htmlspecialchars($devis['prenom'] ?? '', ENT_QUOTES, 'UTF-8');
$clientNom     = htmlspecialchars($devis['nom'] ?? '', ENT_QUOTES, 'UTF-8');
$clientEmail   = htmlspecialchars($devis['email'] ?? '', ENT_QUOTES, 'UTF-8');
$clientTel     = htmlspecialchars($devis['telephone'] ?? '', ENT_QUOTES, 'UTF-8');
$typeEvenement = htmlspecialchars($devis['typeEvenement'] ?? '', ENT_QUOTES, 'UTF-8');
$dateEvenement = htmlspecialchars($devis['dateEvenement'] ?? '', ENT_QUOTES, 'UTF-8');
$nbPersonnes   = intval($devis['nbPersonnes'] ?? 0);
$devisNumber   = htmlspecialchars($devis['devisNumber'] ?? '', ENT_QUOTES, 'UTF-8');
$totalTTC      = number_format(floatval($devis['totalTTC'] ?? 0), 2, ',', ' ');

$dateFormatted = '';
if (!empty($dateEvenement)) {
    $ts = strtotime($dateEvenement);
    if ($ts !== false) {
        $dateFormatted = strftime('%d/%m/%Y', $ts);
        if ($dateFormatted === false) {
            $dateFormatted = date('d/m/Y', $ts);
        }
    }
}
if (empty($dateFormatted)) {
    $dateFormatted = $dateEvenement;
}

$dashboardUrl = rtrim($siteUrl, '/') . '/dashboard';

$subject = "[$siteName] Nouveau devis $devisNumber — $clientPrenom $clientNom";

$html = <<<HTML
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Nouveau devis</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.12);">
        <!-- Header -->
        <tr>
          <td style="background:#1a1a2e;padding:30px 40px;text-align:center;">
            <h1 style="margin:0;color:#c9a84c;font-size:28px;letter-spacing:2px;">$siteName</h1>
            <p style="margin:8px 0 0;color:#aaa;font-size:14px;">Nouveau devis reçu</p>
          </td>
        </tr>
        <!-- Devis number banner -->
        <tr>
          <td style="background:#c9a84c;padding:14px 40px;text-align:center;">
            <span style="color:#1a1a2e;font-size:18px;font-weight:700;">📋 Devis n° $devisNumber</span>
          </td>
        </tr>
        <!-- Client info -->
        <tr>
          <td style="padding:30px 40px;">
            <h2 style="color:#1a1a2e;font-size:16px;margin:0 0 16px;border-bottom:2px solid #f0e6d0;padding-bottom:8px;">👤 Informations client</h2>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;width:40%;">Nom complet</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px;">$clientPrenom $clientNom</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;">Email</td>
                <td style="padding:6px 0;font-size:14px;"><a href="mailto:$clientEmail" style="color:#1a1a2e;">$clientEmail</a></td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;">Téléphone</td>
                <td style="padding:6px 0;font-size:14px;">$clientTel</td>
              </tr>
            </table>

            <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #f0e6d0;padding-bottom:8px;">🎉 Événement</h2>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;width:40%;">Type</td>
                <td style="padding:6px 0;font-weight:600;font-size:14px;">$typeEvenement</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;">Date</td>
                <td style="padding:6px 0;font-size:14px;">$dateFormatted</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#888;font-size:14px;">Nombre de personnes</td>
                <td style="padding:6px 0;font-size:14px;">$nbPersonnes</td>
              </tr>
            </table>

            <h2 style="color:#1a1a2e;font-size:16px;margin:24px 0 16px;border-bottom:2px solid #f0e6d0;padding-bottom:8px;">💰 Montant</h2>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding:10px 16px;background:#1a1a2e;color:#fff;font-size:15px;font-weight:600;border-radius:6px 0 0 6px;width:40%;">Total TTC</td>
                <td style="padding:10px 16px;background:#1a1a2e;color:#c9a84c;font-size:20px;font-weight:800;border-radius:0 6px 6px 0;text-align:right;">$totalTTC €</td>
              </tr>
            </table>

            <div style="margin-top:32px;text-align:center;">
              <a href="$dashboardUrl" style="display:inline-block;background:#c9a84c;color:#1a1a2e;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
                🔐 Voir dans le tableau de bord
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f5f0;padding:20px 40px;text-align:center;color:#aaa;font-size:12px;">
            Cet email a été généré automatiquement par $siteName.<br>
            <a href="$siteUrl" style="color:#c9a84c;text-decoration:none;">$siteUrl</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$siteNameEncoded = mb_encode_mimeheader($siteName, 'UTF-8');
$headers .= "From: $siteNameEncoded <noreply@leparadise77.fr>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$sent = mail($adminEmail, $subject, $html, $headers);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send email']);
}
