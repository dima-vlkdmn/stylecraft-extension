import { Color, ColorFormat, HSL } from '@mirawision/colorize';

import { rybslColorsMixing } from './rybsl-colors-mixing';

const round = (num: number) => Math.round(num * 100) / 100;

const getBaseColorsProportions = (hsl: HSL): { red: number, yellow: number, blue: number } => {
  const { h } = hsl;

  if (h >= 0 && h < 60) {
    const ratio = h / 60;

    return {
      red: round(1 - ratio),
      yellow: round(ratio),
      blue: 0
    };
  }

  if (h >= 60 && h < 240) {
    const ratio = (h - 60) / 180;

    return {
      red: 0,
      yellow: round(1 - ratio),
      blue: round(ratio),
    };
  }

  if (h >= 240 && h <= 360) {
    const ratio = (h - 240) / 120;

    return {
      red: round(ratio),
      yellow: 0,
      blue: round(1 - ratio),
    };
  }

  return { red: 0, yellow: 0, blue: 0 };
};

const isColorless = (hsl: HSL) => {
  const { s, l } = hsl;

  return s === 0 || l === 0 || l === 100;
}

const rybslExtractColors = (color: string) => {
  const hsl = new Color(color).parseNumbers(ColorFormat.HSL) as HSL;

  const { red, yellow, blue } = isColorless(hsl) ? { red: 0, yellow: 0, blue: 0 } : getBaseColorsProportions(hsl);

  const redCount = Math.round(red * 10);

  const yellowCount = Math.round(yellow * 10);

  const blueCount = Math.round(blue * 10);

  let totalCount = redCount + yellowCount + blueCount;

  const saturationCount = Math.round(100 * totalCount / hsl.s) - totalCount;

  totalCount += saturationCount;

  const blackCount = hsl.l < 50 ? Math.round(totalCount * 50 / hsl.l - totalCount) : 0;

  const whiteCount = hsl.l > 50 ? Math.round(totalCount * (hsl.l - 50) / (100 - hsl.l)) : 0;

  const colors = [
    { color: '#ff0000', weight: redCount },
    { color: '#ffff00', weight: yellowCount },
    { color: '#0000ff', weight: blueCount },
    { color: '#808080', weight: saturationCount },
    { color: '#ffffff', weight: whiteCount },
    { color: '#000000', weight: blackCount },
  ];

  const mixedColor = rybslColorsMixing(colors);

  return {
    color: mixedColor,
    red: redCount,
    yellow: yellowCount,
    blue: blueCount,
    grey: saturationCount,
    white: whiteCount,
    black: blackCount,
  }
};

export {
  rybslExtractColors,
};
