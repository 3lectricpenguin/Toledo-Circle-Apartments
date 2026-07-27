const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const targetUrl = process.argv[2] || 'https://toledocircleapartments.com/connect.html';
const imagesDir = path.join(__dirname, '..', 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const pngPath = path.join(imagesDir, 'qr-code.png');
const svgPath = path.join(imagesDir, 'qr-code.svg');

// Generate high-res PNG (with brand color accent #985624)
const pngOptions = {
  errorCorrectionLevel: 'H',
  type: 'image/png',
  quality: 0.95,
  margin: 2,
  width: 1024,
  color: {
    dark: '#2C1E14',   // Deep espresso brand dark
    light: '#FAF8F5'   // Warm cream brand bg
  }
};

// Generate SVG
const svgOptions = {
  errorCorrectionLevel: 'H',
  type: 'svg',
  margin: 2,
  color: {
    dark: '#2C1E14',
    light: '#FAF8F5'
  }
};

async function generate() {
  try {
    await QRCode.toFile(pngPath, targetUrl, pngOptions);
    console.log(`Successfully generated PNG QR Code at: ${pngPath}`);

    const svgString = await QRCode.toString(targetUrl, svgOptions);
    fs.writeFileSync(svgPath, svgString, 'utf8');
    console.log(`Successfully generated SVG QR Code at: ${svgPath}`);

    console.log(`QR Code Destination URL: ${targetUrl}`);
  } catch (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
}

generate();
