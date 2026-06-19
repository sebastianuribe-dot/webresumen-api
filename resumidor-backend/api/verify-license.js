// ============================================================
// WebResumen — Verificación de licencia Gumroad
// Archivo: api/verify-license.js
// ============================================================

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { licenseKey } = req.body;

  if (!licenseKey || typeof licenseKey !== 'string' || licenseKey.trim().length < 5) {
    return res.status(400).json({ valid: false, error: 'Código requerido' });
  }

  const productPermalink = process.env.GUMROAD_PRODUCT_PERMALINK;

  if (!productPermalink) {
    // Si no está configurado Gumroad aún, aceptar modo demo
    // ELIMINA ESTO cuando tengas tu producto real en Gumroad
    console.warn('GUMROAD_PRODUCT_PERMALINK no configurado — modo demo activo');
    return res.status(200).json({ valid: true, demo: true });
  }

  try {
    const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        product_permalink: productPermalink,
        license_key: licenseKey.trim(),
        increment_uses_count: 'false'
      })
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ valid: true });
    } else {
      return res.status(200).json({
        valid: false,
        error: data.message === 'That license does not exist for the provided product.'
          ? 'Código no encontrado. Verifica que lo copiaste bien.'
          : 'Código inválido o ya usado.'
      });
    }
  } catch (error) {
    console.error('Error verificando licencia:', error);
    return res.status(500).json({ valid: false, error: 'Error de conexión. Intenta de nuevo.' });
  }
}
