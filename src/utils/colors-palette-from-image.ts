import { convertColor, ColorFormat } from '@mirawision/colorize';

interface ColorData {
  count: number;
  sumR: number;
  sumG: number;
  sumB: number;
  coordinates: { x: number; y: number }[];
}

const colors: { [key: string]: ColorData } = {};

const getPaletteWithCoordinates = (
  image: HTMLImageElement,
  numColors: number,
  imgWidth: number,
  imgHeight: number,
  initialThreshold: number = 16,
  maxIterations: number = 5,
  skipPixels: number = 10
): { color: string; x: number; y: number }[] => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return [];

  if (image.naturalWidth === 0 || image.naturalHeight === 0) {
    console.error('Image has invalid dimensions.');
    return [];
  }

  canvas.width = imgWidth;
  canvas.height = imgHeight;

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let threshold = initialThreshold;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const colors: Record<string, ColorData> = {};

    for (let y = 0; y < height; y += skipPixels) {
      for (let x = 0; x < width; x += skipPixels) {
        const index = (y * width + x) * 4;
        const r = Math.round(data[index] / threshold) * threshold;
        const g = Math.round(data[index + 1] / threshold) * threshold;
        const b = Math.round(data[index + 2] / threshold) * threshold;
        const rgb = `${r},${g},${b}`;

        if (!colors[rgb]) {
          colors[rgb] = { count: 0, sumR: 0, sumG: 0, sumB: 0, coordinates: [] };
        }
        colors[rgb].count++;
        colors[rgb].sumR += data[index];
        colors[rgb].sumG += data[index + 1];
        colors[rgb].sumB += data[index + 2];
        colors[rgb].coordinates.push({ x, y });
      }
    }

    const sortedColors = Object.entries(colors).sort((a, b) => b[1].count - a[1].count);

    if (sortedColors.length <= numColors) {
      const palette = sortedColors.slice(0, numColors).map(([color, data]) => {
        const avgR = Math.round(data.sumR / data.count);
        const avgG = Math.round(data.sumG / data.count);
        const avgB = Math.round(data.sumB / data.count);
        const rgbString = `rgb(${avgR},${avgG},${avgB})`;
        const hexColor = convertColor(rgbString, ColorFormat.HEX);
        const { x, y } = data.coordinates[0];
        return { color: hexColor, x, y };
      });
      return palette;
    }

    threshold *= 2;
  }

  const finalColors = Object.entries(colors)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, numColors)
    .map(([color, data]) => {
      const avgR = Math.round(data.sumR / data.count);
      const avgG = Math.round(data.sumG / data.count);
      const avgB = Math.round(data.sumB / data.count);
      const rgbString = `rgb(${avgR},${avgG},${avgB})`;
      const hexColor = convertColor(rgbString, ColorFormat.HEX);
      const { x, y } = data.coordinates[0];
      return { color: hexColor, x, y };
    });

  return finalColors;
};

export { getPaletteWithCoordinates };