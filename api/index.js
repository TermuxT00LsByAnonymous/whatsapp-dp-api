export default async function handler(req, res) {
  // 1. Full CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Preflight request handle karne ke liye
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { number, type } = req.query;

  // Agar number missing ho toh guide aur credits dikhaye
  if (!number) {
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host;
    return res.status(400).json({
      status: false,
      message: 'Please provide a WhatsApp number with country code (without +)',
      example: `${protocol}://${host}/api?number=923113414404`,
      developed_by: 'Elbert Hubbard',
      join_channel: 'https://t.me/+lhI8wm_iqhhmMDNk'
    });
  }

  // Number mein se '+' ya spaces waghera clean karne ke liye
  const cleanNumber = number.replace(/[^0-9]/g, '');

  // ==========================================================
  // MODE 1: Agar URL mein &type=image hai toh Direct Image show kare
  // ==========================================================
  if (type === 'image') {
    try {
      const targetUrl = `https://unavatar.io{cleanNumber}`;
      
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        return res.status(response.status).json({
          status: false,
          message: 'Failed to fetch WhatsApp DP',
          developed_by: 'Elbert Hubbard',
          join_channel: 'https://t.me/+lhI8wm_iqhhmMDNk'
        });
      }

      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(buffer);

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Error fetching image from upstream server',
        error: error.message,
        developed_by: 'Elbert Hubbard',
        join_channel: 'https://t.me/+lhI8wm_iqhhmMDNk'
      });
    }
  }

  // ==========================================================
  // MODE 2: Default JSON Response
  // ==========================================================
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  const myCustomImageUrl = `${protocol}://${host}/api?number=${cleanNumber}&type=image`;

  return res.status(200).json({
    status: true,
    number: cleanNumber,
    image_url: myCustomImageUrl,
    developed_by: 'Elbert Hubbard',
    join_channel: 'https://t.me/+lhI8wm_iqhhmMDNk'
  });
        }
          
