const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Segunda passagem nas imagens de fundo que ficaram grandes
const targets = [
  { file: 'hero.jpg', quality: 55, width: 1920 },
  { file: 'hero2.jpg', quality: 55, width: 1920 },
  { file: 'servicos-bg.jpg', quality: 55, width: 1920 },
  { file: 'servico-imersao.jpg', quality: 60, width: 1200 },
  { file: 'como-funciona-bg.jpg', quality: 55, width: 1920 },
  { file: 'dores-bg.jpg', quality: 55, width: 1920 },
  { file: 'depoimentos-bg.jpg', quality: 55, width: 1920 },
];

const imgDir = path.join(__dirname, 'assets/img');

async function compress() {
  for (const t of targets) {
    const input = path.join(imgDir, t.file);
    if (!fs.existsSync(input)) continue;
    const before = (fs.statSync(input).size / 1024).toFixed(0);
    const tmpOut = input + '.tmp';
    await sharp(input).resize({ width: t.width, withoutEnlargement: true }).jpeg({ quality: t.quality, progressive: true }).toFile(tmpOut);
    const after = (fs.statSync(tmpOut).size / 1024).toFixed(0);
    fs.renameSync(tmpOut, input);
    console.log(`✓ ${t.file}: ${before}KB → ${after}KB`);
  }
  console.log('\nConcluído!');
}

compress();
