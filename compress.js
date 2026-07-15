const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets/img');
const files = fs.readdirSync(imgDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

async function compress() {
  for (const file of files) {
    const input = path.join(imgDir, file);
    const ext = path.extname(file).toLowerCase();
    const before = (fs.statSync(input).size / 1024 / 1024).toFixed(1);

    const tmpOut = input + '.tmp';

    try {
      if (ext === '.png') {
        await sharp(input).png({ quality: 80, compressionLevel: 9 }).toFile(tmpOut);
      } else {
        await sharp(input).jpeg({ quality: 75, progressive: true }).toFile(tmpOut);
      }

      const after = (fs.statSync(tmpOut).size / 1024 / 1024).toFixed(1);
      fs.renameSync(tmpOut, input);
      console.log(`✓ ${file}: ${before}MB → ${after}MB`);
    } catch (e) {
      if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut);
      console.log(`✗ ${file}: erro — ${e.message}`);
    }
  }
  console.log('\nConcluído!');
}

compress();
