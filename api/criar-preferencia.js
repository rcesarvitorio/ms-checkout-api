import pkg from 'mercadopago';
const mercadopago = pkg;

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const preference = {
      items: [
        {
          title: 'Produto Teste',
          unit_price: 50,
          quantity: 1,
        },
      ],
    };

    const response = await mercadopago.preferences.create(preference);
    res.status(200).json({ preferenceId: response.body.id });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
}
