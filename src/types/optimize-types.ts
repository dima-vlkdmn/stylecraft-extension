interface LargeImage {
  index: number;
  src: string;
  size: number;
  selector: string;
  isTooLarge: boolean;
  isLazy: boolean;
}

interface OptimizeSummary {
  isHttps: boolean;
  missingSecurityHeaders: string[];
  totalImages: number;
  largeImages: number;
  lazyLoadedLargeImages: number;
}

interface OptimizeAuditResult {
  summary: OptimizeSummary;
  largeImages: LargeImage[];
  recommendations: string[];
}

export { LargeImage, OptimizeSummary, OptimizeAuditResult };