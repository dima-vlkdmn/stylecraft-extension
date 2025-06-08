import { ColorFormat, HSL, convertColor, parseColorNumbers } from '@mirawision/colorize';

interface Color {
  color: string;
  weight: number;
}

interface ColorSettings {
  h: number;
  s: number;
  l: number;
  hWeight: number;
  sWeight: number;
  lWeight: number;
}

const rybslColorsMixing = (colors: Color[]): string => {
  const colorSettings: ColorSettings[] = colors
    .filter(({ weight }) => weight > 0)
    .map(({ color, weight }) => {
      const { h, s, l } = parseColorNumbers(convertColor(color, ColorFormat.HSL), ColorFormat.HSL) as HSL;

      const lWeight = weight;

      const sWeight = (50 - Math.abs(50 - l)) / 50 * weight;

      const hWeight = (s / 100) * sWeight;

      return {
        h,
        s,
        l,
        lWeight,
        sWeight,
        hWeight,
      };
    })
    .sort((a, b) => a.h - b.h);

  let hValues = colorSettings
    .map(({ h, hWeight }, index) => ({ h, hWeight, index }))
    .filter(({ hWeight }) => hWeight > 0.2)
    .sort((a, b) => a.h - b.h);

  if (hValues.length >= 2) {
    while (hValues[hValues.length - 1].h - hValues[0].h > hValues[0].h + 360 - hValues[1].h) {
      const { h, hWeight, index } = hValues.shift()!;

      hValues.push({ h: h + 360, hWeight, index });
    }
  }

  hValues.forEach(({ h, index }) => {
    colorSettings[index].h = h;
  });

  const totalHWeight = colorSettings.reduce((acc, { hWeight }) => acc + hWeight, 0) || 1;

  const totalSWeight = colorSettings.reduce((acc, { sWeight }) => acc + sWeight, 0) || 1;

  const totalLWeight = colorSettings.reduce((acc, { lWeight }) => acc + lWeight, 0) || 1;

  const h = colorSettings.reduce((acc, { h, hWeight }) => acc + (h * hWeight / totalHWeight), 0) % 360;

  const s = colorSettings.reduce((acc, { s, sWeight }) => acc + (s * sWeight / totalSWeight), 0);

  const l = colorSettings.reduce((acc, { l, lWeight }) => acc + (l * lWeight / totalLWeight), 0);

  const hsl = `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;

  return convertColor(hsl, ColorFormat.HEX);
};

export { rybslColorsMixing };
