export interface LargeImage {
  index: number;
  src: string;
  size: number; // KB
  selector: string;
  isTooLarge: boolean;
  isLazy: boolean;
}

export interface OptimizeSummary {
  isHttps: boolean;
  missingSecurityHeaders: string[];
  totalImages: number;
  largeImages: number;
  lazyLoadedLargeImages: number;
}

export interface OptimizeAuditResult {
  summary: OptimizeSummary;
  largeImages: LargeImage[];
  recommendations: string[];
  optimizedMap?: Record<number, string>;
}

export interface OptimizeState {
  summary: OptimizeSummary | null;
  largeImages: LargeImage[];
  recommendations: string[];
  optimizedMap: Record<number, string>;
}
