export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Política de Privacidad — WebResumen</title>
<style>body{font-family:sans-serif;max-width:700px;margin:40px auto;padding:0 20px;line-height:1.6;color:#333}</style>
</head>
<body>
<h1>Política de Privacidad de WebResumen</h1>
<p><strong>Última actualización:</strong> junio de 2026</p>

<h2>Datos que recopilamos</h2>
<p>WebResumen accede al texto de la página web activa únicamente cuando el usuario presiona "Resumir esta página". Este texto se envía a nuestro servidor para generar el resumen con IA.</p>

<h2>Cómo usamos los datos</h2>
<p>El texto de la página se usa exclusivamente para generar el resumen solicitado. No almacenamos, vendemos ni compartimos el contenido de las páginas con terceros.</p>

<h2>Almacenamiento local</h2>
<p>La extensión guarda localmente en tu dispositivo: el contador de uso diario, la fecha del último uso y tu clave de licencia Pro (si aplica). Estos datos nunca salen de tu dispositivo.</p>

<h2>Terceros</h2>
<p>Usamos Anthropic (Claude API) para procesar los resúmenes y Gumroad para verificar licencias Pro. Ninguno de estos servicios recibe datos de identificación personal tuya.</p>

<h2>Contacto</h2>
<p>¿Preguntas? Escríbenos a: inorestorei@gmail.com</p>
</body></html>`);
}
