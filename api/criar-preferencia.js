export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Itens obrigatórios faltando ou inválidos.' });
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const text = await response.text();
    console.log('📨 Resposta do Mercado Pago (preferência):', text);

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);

    res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (error) {
    console.error('❌ Erro ao criar preferência:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}
