export default async function handler(req, res) {
  // ✅ Domínios permitidos
  const allowedOrigins = [
    'http://localhost:8080',
    'https://entrega-segura-rio.lovable.app',
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const {
      transaction_amount,
      description,
      payer
    } = req.body;

    if (
      !transaction_amount ||
      !description ||
      !payer?.email ||
      !payer?.first_name ||
      !payer?.last_name ||
      !payer?.identification?.type ||
      !payer?.identification?.number
    ) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes ou inválidos.' });
    }

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        transaction_amount,
        description,
        payment_method_id: 'pix',
        payer,
      }),
    });

    const text = await response.text();
    console.log('📨 Resposta Mercado Pago:', text);

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);

    const qr = data.point_of_interaction?.transaction_data;

    return res.status(200).json({
      id: data.id,
      status: data.status,
      qr_code: qr?.qr_code,
      qr_code_base64: qr?.qr_code_base64,
    });
  } catch (error) {
    console.error('❌ Erro ao criar Pix:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}
