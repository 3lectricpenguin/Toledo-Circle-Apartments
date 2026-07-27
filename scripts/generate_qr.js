const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');

const targetUrl = process.argv[2] || 'https://toledocircleapartments.com/connect.html';
const imagesDir = path.join(__dirname, '..', 'images');
const logoPath = path.join(imagesDir, 'Toledo_Circle_Logo.jpeg');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const pngPath = path.join(imagesDir, 'qr-code.png');
const svgPath = path.join(imagesDir, 'qr-code.svg');

async function generateWithLogo() {
  try {
    console.log(`Generating QR code for: ${targetUrl}`);

    // 1. Generate base SVG from QRCode library with High Error Correction ('H')
    const rawSvg = await QRCode.toString(targetUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      color: {
        dark: '#2C1E14',   // Deep espresso brand color
        light: '#FAF8F5'   // Warm cream background
      }
    });

    // 2. Read logo image & convert to Base64 for inline SVG embedding
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;

    // Extract viewBox size from raw SVG
    const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
    const viewBoxSize = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 37;

    // Calculate center badge dimensions in SVG units
    const badgeRatio = 0.26; // ~26% of QR size for emblem badge
    const badgeSize = viewBoxSize * badgeRatio;
    const badgePos = (viewBoxSize - badgeSize) / 2;
    const innerImageSize = badgeSize * 0.85;
    const innerImagePos = (viewBoxSize - innerImageSize) / 2;

    // Construct SVG emblem overlay
    const svgOverlay = `
      <g id="tca-centered-logo">
        <!-- Outer badge shadow & background container -->
        <rect x="${badgePos}" y="${badgePos}" width="${badgeSize}" height="${badgeSize}" rx="${badgeSize * 0.2}" fill="#FAF8F5" stroke="#E5E0DA" stroke-width="${viewBoxSize * 0.01}" />
        <!-- Logo Image -->
        <image x="${innerImagePos}" y="${innerImagePos}" width="${innerImageSize}" height="${innerImageSize}" href="${logoBase64}" preserveAspectRatio="xMidYMid slice" clip-path="url(#logo-clip)" />
        <clipPath id="logo-clip">
          <rect x="${innerImagePos}" y="${innerImagePos}" width="${innerImageSize}" height="${innerImageSize}" rx="${innerImageSize * 0.15}" />
        </clipPath>
      </g>
    </svg>`;

    // Insert emblem overlay before closing </svg> tag
    const finalSvg = rawSvg.replace('</svg>', svgOverlay);
    fs.writeFileSync(svgPath, finalSvg, 'utf8');
    console.log(`Successfully saved SVG with logo at: ${svgPath}`);

    // 3. Render high-resolution PNG (1024x1024) from SVG using sharp
    await sharp(Buffer.from(finalSvg))
      .resize(1024, 1024)
      .png({ quality: 100 })
      .toFile(pngPath);

    console.log(`Successfully saved high-res PNG with logo at: ${pngPath}`);

  } catch (err) {
    console.error('Error generating QR code with logo:', err);
    process.exit(1);
  }
}

generateWithLogo();
