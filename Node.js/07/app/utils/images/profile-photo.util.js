import sharp from 'sharp';

async function getSquareCrop(inputImagePath) {
  const metadata = await sharp(inputImagePath).metadata();
  const { width, height } = metadata;
  const squareSize = Math.min(width, height);

  return {
    squareSize,
    left: Math.floor((width - squareSize) / 2),
    top: Math.floor((height - squareSize) / 2),
  };
}

function circleMask(squareSize) {
  return Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}"><rect x="0" y="0" width="${squareSize}" height="${squareSize}" rx="${squareSize / 2}" ry="${squareSize / 2}"/></svg>`
  );
}

export async function cropSquareImage(inputImagePath, outputImagePath) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);

  await sharp(inputImagePath)
    .extract({ left: left, top: top, width: squareSize, height: squareSize })
    .toFile(outputImagePath);
}

export async function overlayCircle(inputImagePath, outputImagePath) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);

  await sharp(inputImagePath)
    .extract({ left, top, width: squareSize, height: squareSize })
    .composite([
      {
        input: circleMask(squareSize),
        blend: 'dest-in',
      },
    ])
    .toFormat('png')
    .toFile(outputImagePath);
}

export async function overlayText(inputImagePath, outputImagePath, text) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);
  const fontSize = Math.floor(squareSize * 0.7);
  const textColor = 'yellow';
  const fontFamily = 'Arial, sans-serif';

  const letterSvgBuffer = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}" viewBox="0 0 ${squareSize} ${squareSize}">
 <rect x="0" y="0" width="100%" height="100%" fill="rgba(255,0,0,0.5)"/> 
 <text
 x="50%" y="50%"
 alignment-baseline="middle"
 text-anchor="middle"
 font-family="${fontFamily}"
 font-size="${fontSize}"
 fill="${textColor}"
 >${text}</text>
 </svg>`
  );

  await sharp(inputImagePath)
    .extract({ left, top, width: squareSize, height: squareSize })
    .composite([
      { input: circleMask(squareSize), blend: 'dest-in' },
      { input: letterSvgBuffer, blend: 'over' },
    ])
    .toFormat('png')
    .toFile(outputImagePath);
}

export async function overlayGradient(inputImagePath, outputImagePath) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);
  const strokeWidth = Math.max(8, Math.floor(squareSize * 0.08));
  const borderRadius = squareSize / 2 - strokeWidth / 2;

  const gradientSvg = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}" >
 <defs>
 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stop-color="#f00"/>
 <stop offset="100%" stop-color="#00f"/>
 </linearGradient>
 </defs>
 <circle cx="${squareSize / 2}" cy="${squareSize / 2}" r="${borderRadius}" fill="none" stroke="url(#gradient)" stroke-width="${strokeWidth}"/>
 </svg>`
  );

  await sharp(inputImagePath)
    .extract({ left, top, width: squareSize, height: squareSize })
    .composite([
      { input: circleMask(squareSize), blend: 'dest-in' },
      { input: gradientSvg, blend: 'over' },
    ])
    .toFormat('png')
    .toFile(outputImagePath);
}

export async function overlayPattern(inputImagePath, outputImagePath) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);

  const patternSvg = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}" >
 <defs>
 <pattern id="stripes" width="10" height="20" patternUnits="userSpaceOnUse">
 <rect width="10" height="10" fill="white" />
 <rect y="10" width="10" height="10" fill="black" />
 </pattern>
 </defs>
 <rect x="0" y="0" width="${squareSize}" height="${squareSize}" fill="url(#stripes)" />
 </svg>`
  );

  await sharp(inputImagePath)
    .extract({ left, top, width: squareSize, height: squareSize })
    .composite([
      {
        input: patternSvg,
        blend: 'overlay',
      },
    ])
    .toFormat('png')
    .toFile(outputImagePath);
}

export async function overlayCircleBorder(inputImagePath, outputImagePath) {
  const { squareSize, left, top } = await getSquareCrop(inputImagePath);
  const strokeWidth = Math.max(8, Math.floor(squareSize * 0.08));
  const borderRadius = squareSize / 2 - strokeWidth / 2;

  const yellowBorderSvgBuffer = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}">
 <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0)"/> 
 
 <circle cx="${squareSize / 2}" cy="${squareSize / 2}" r="${borderRadius}" fill="none" stroke="yellow" stroke-width="${strokeWidth}"/>
 </svg>`
  );

  await sharp(inputImagePath)
    .extract({ left, top, width: squareSize, height: squareSize })
    .composite([
      { input: circleMask(squareSize), blend: 'dest-in' },
      { input: yellowBorderSvgBuffer, blend: 'over' },
    ])
    .toFormat('png')
    .toFile(outputImagePath);
}
