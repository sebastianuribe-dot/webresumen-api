// ============================================================
// WebResumen — Backend Vercel
// Archivo: api/summarize.js
// ============================================================

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── Prompts por formato ───────────────────────────────────────
const PROMPTS = {
  rapido: (title, text) =>
    `Resume el siguiente contenido web en exactamente 3-4 oraciones concisas. Detecta el idioma del texto y responde en ese mismo idioma. Captura solo lo más importante. No uses introducción ni explicación.

Título: ${title}
Contenido: ${text}`,

  detallado: (title, text) =>
    `Analiza el siguiente contenido web y proporciona un resumen estructurado. Detecta el idioma y responde en ese mismo idioma.

Usa este formato exacto:
• [punto clave 1]
• [punto clave 2]
• [punto clave 3]
• [punto clave 4]
• [punto clave 5]

Conclusión: [1-2 oraciones con la idea central]

No pongas introducción antes de los puntos.

Título: ${title}
Contenido: ${text}`,

  qa: (title, text) =>
    `Lee el siguiente contenido y crea 4 preguntas y respuestas que capturen la información más importante. Detecta el idioma y responde en ese mismo idioma.

Usa este formato exacto:
❓ [Pregunta]
→ [Respuesta concisa]

❓ [Pregunta]
→ [Respuesta concisa]

(repite para las 4 preguntas)

No pongas introducción.

Título: ${title}
Contenido: ${text}`
};

// ── Handler principal ─────────────────────────────────────────
export default async function handler(req, res) {
  // CORS — permite peticiones desde la extensión Chrome
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { text, format = 'rapido', title = '', url = '' } = req.body;

    // Validación básica
    if (!text || typeof text !== 'string' || text.trim().length < 80) {
      return res.status(400).json({ error: 'Contenido insuficiente para resumir' });
    }

    // Limitar texto para controlar costos
    const cleanText = text.trim().slice(0, 6000);
    const promptFn = PROMPTS[format] || PROMPTS.rapido;
    const prompt = promptFn(title.slice(0, 200), cleanText);

    // Llamada a Claude Haiku (el modelo más económico)
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }]
    });

    const summary = message.content[0]?.text || 'No se pudo generar el resumen.';

    return res.status(200).json({ summary, format });

  } catch (error) {
    console.error('Error en summarize:', error);

    if (error.status === 401) {
      return res.status(500).json({ error: 'API key inválida. Verifica tu clave en Vercel.' });
    }
    if (error.status === 429) {
      return res.status(429).json({ error: 'Límite de API alcanzado. Intenta en unos segundos.' });
    }

    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
