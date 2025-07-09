import pkg from 'mercadopago';
const mercadopago = pkg;

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await mercadopago.payment.create({
      transaction_amount: 50,
      description: "Pagamento via Pix",
      payment_method_id: "pix",
      payer: {
        email: "comprador@email.com",
        first_name: "Fulano",
        identification: {
          type: "CPF",
          number: "19119119100",
        },
      },
    });

    const qr = response.body.point_of_interaction.transaction_data;

    res.status(200).json({
      qr_code: qr.qr_code,
      qr_code_base64: qr.qr_code_base64,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pagamento Pix" });
  }
}
