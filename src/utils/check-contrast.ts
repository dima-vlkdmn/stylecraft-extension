import { calculateContrast } from '@mirawision/colorize';

interface CheckContrast {
  contrast: number;
  isObjectSuitable: boolean;
  isBackgroundSuitable: boolean;
  isHeaderSuitableForAA: boolean;
  isHeaderSuitableForAAA: boolean;
  isTextSuitableForAA: boolean;
  isTextSuitableForAAA: boolean;
}

const checkContrast = (color1: string, color2: string): CheckContrast => {
  try {
    const contrast = calculateContrast(color1, color2);

    return {
      contrast,
      isObjectSuitable: contrast >= 3,
      isBackgroundSuitable: contrast >= 3,
      isHeaderSuitableForAA: contrast >= 3,
      isHeaderSuitableForAAA: contrast >= 4.5,
      isTextSuitableForAA: contrast >= 4.5,
      isTextSuitableForAAA: contrast >= 7,
    };
  } catch (error) {
    return {
      contrast: 0,
      isObjectSuitable: false,
      isBackgroundSuitable: false,
      isHeaderSuitableForAA: false,
      isHeaderSuitableForAAA: false,
      isTextSuitableForAA: false,
      isTextSuitableForAAA: false,
    };
  }
};

export { checkContrast };