export const config = {
  api: {
    bodyParser: false, // necessário para Vercel + webhook
  },
};

export default async function handler(req, res) {
  let rawBody = '';
  req.on('data', chunk => (rawBody += chunk));
  req.on('end', async () => {
    try {
      const data = JSON.parse(rawBody);
      console.log('🔔 Webhook recebido:', data);

      const paymentId = data.data?.id;

      if (data.type === 'payment') {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        });

        const paymentData = await response.json();
        console.log('📦 Dados do pagamento:', paymentData);

        // Aqui você pode salvar no banco, enviar e-mail etc.

        return res.status(200).end();
      }

      return res.status(204).end(); // outro tipo de notificação
    } catch (e) {
      console.error('Erro no webhook:', e);
      return res.status(500).end();
    }
  });
}
