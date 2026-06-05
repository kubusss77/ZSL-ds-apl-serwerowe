import sharp from 'sharp';

export async function cropSquareImage(inputImagePath, outputImagePath) {
  // metadata z informacją o wymiarach zdjęcia
  const metadata = await sharp(inputImagePath).metadata();
  const { width, height } = metadata;
  console.log('wymiary zdjęcia z metadata', width, height);

  // obliczenia
  const squareSize = Math.min(width, height);
  const left = Math.floor((width - squareSize) / 2);
  const top = Math.floor((height - squareSize) / 2);
  console.log('dimensions', squareSize, squareSize);

  // sharp
  await sharp(inputImagePath)
    .extract({ left: left, top: top, width: squareSize, height: squareSize })
    .toFile(outputImagePath);
}

export async function overlayCircle(inputImagePath, outputImagePath) {
  const { height } = await sharp(inputImagePath).metadata();
  const squareSize = height;

  const roundedCorners = Buffer.from(
    `<svg><rect x="0" y="0" width="${squareSize}" height="${squareSize}" rx="${squareSize / 2}" ry="${squareSize / 2}"/></svg>`
  );

  await sharp(inputImagePath)
    .composite([
      {
        input: roundedCorners,
        blend: 'dest-in',
      },
    ])
    .toFile(outputImagePath);
}

export async function overlayText(inputImagePath, outputImagePath, text) {
  const fontSize = Math.floor(squareSize * 0.7);
  const textColor = 'yellow';
  const fontFamily = 'Arial, sans-serif';

  const { height } = await sharp(inputImagePath).metadata();
  const squareSize = height;

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

  // tablica .composite() przyjmuje wiele obiektów jednocześnie.
  // aby nałożyć maskę okrągłą i tekst w jednej operacji, przekazujemy je razem:

  await sharp(inputImagePath)
    .composite([
      { input: letterSvgBuffer, blend: 'over' }, // Nałożenie tekstu na wierzch
    ])
    .toFile(outputImagePath);
}

export async function overlayGradient(inputImagePath, outputImagePath) {
  const { height } = await sharp(inputImagePath).metadata();
  const squareSize = height;
  const borderRadius = squareSize / 2;

  const gradientSvg = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}" >
 <defs>
 <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
 <stop offset="0%" stop-color="#f00"/>
 <stop offset="100%" stop-color="#00f"/>
 </linearGradient>
 </defs>
 
 // aby grube obramowanie (stroke-width="50") nie zostało ucięte przez krawędzie ramki SVG,
 // promień koła pomniejszamy o połowę grubości tego obramowania (czyli o 25px).
 <circle cx="${squareSize / 2}" cy="${squareSize / 2}" r="${borderRadius - 25}" fill="none" stroke="url(#gradient)" stroke-width="50"/>
 </svg>`
  );

  await sharp(inputImagePath)
    .composite([
      { input: gradientSvg, blend: 'over' }, // Nałożenie gradientu na wierzch
    ])
    .toFile(outputImagePath);
}

export async function overlayPattern(inputImagePath, outputImagePath) {
  const { height } = await sharp(inputImagePath).metadata();
  const squareSize = height;

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

  // Wymuszenie formatu wyjściowego (.toFormat('png')) jest konieczne,
  // ponieważ formaty bez przezroczystości (jak .jpg) nie obsłużą poprawnie zaawansowanych efektów przezroczystości masek i blendowania.

  await sharp(inputImagePath)
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
  const { height } = await sharp(inputImagePath).metadata();
  const squareSize = height;
  const strokeWidth = 20;
  const borderRadius = squareSize / 2 - strokeWidth / 2;

  const yellowBorderSvgBuffer = Buffer.from(
    `<svg width="${squareSize}" height="${squareSize}">
 <rect x="0" y="0" width="100%" height="100%" fill="rgba(0,0,0,0)"/> 
 
 <circle cx="${squareSize / 2}" cy="${squareSize / 2}" r="${borderRadius}" fill="none" stroke="yellow" stroke-width="${strokeWidth}"/>
 </svg>`
  );

  await sharp(inputImagePath)
    .composite([
      { input: yellowBorderSvgBuffer, blend: 'over' }, // Nałożenie gradientu na wierzch
    ])
    .toFile(outputImagePath);
}
