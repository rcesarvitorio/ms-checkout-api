export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_amount: 50,
        description: 'Pagamento Pix sem SDK',
        payment_method_id: 'pix',
        payer: {
          email: 'comprador@email.com',
          first_name: 'Fulano',
          identification: {
            type: 'CPF',
            number: '19119119100',
          },
        },
      }),
    });

    const text = await response.text();
    console.log('🔍 Resposta bruta Mercado Pago:', text);

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);

    const qr = data.point_of_interaction.transaction_data;

    res.status(200).json({
      id: data.id,
      status: data.status,
      qr_code: qr.qr_code,
      qr_code_base64: qr.qr_code_base64,
    });
  } catch (error) {
    console.error('❌ Erro ao criar Pix:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}
