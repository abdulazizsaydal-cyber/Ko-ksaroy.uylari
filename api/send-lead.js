export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, phone, visitTime, variant } = req.body || {};

    if (!name || !phone) {
      res.status(400).json({ error: 'Ism yoki telefon yetishmayapti' });
      return;
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      res.status(500).json({ error: 'Server sozlanmagan (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID yo\'q)' });
      return;
    }

    const variantLabel = { site1: '1 - Naqd', site2: '2 - Bo\'lib to\'lash', site3: '3 - Barter' }[variant] || variant || 'noma\'lum';

    const text =
      '🏠 Yangi ariza — Ko\'k Saroy uylari\n\n' +
      '👤 Ism: ' + String(name).slice(0, 200) + '\n' +
      '📞 Telefon: ' + String(phone).slice(0, 50) + '\n' +
      '🗓 Kelish vaqti: ' + String(visitTime || 'ko\'rsatilmagan').slice(0, 100) + '\n' +
      '🔖 Sayt varianti: ' + variantLabel;

    const tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: text }),
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      res.status(502).json({ error: 'Telegram xatosi', details: tgData });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server xatosi' });
  }
}
