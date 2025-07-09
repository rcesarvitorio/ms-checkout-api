export default function handler(req, res) {
  console.log("Webhook recebido:", req.body);
  res.status(200).end();
}
