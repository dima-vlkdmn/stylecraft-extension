export interface MetaTagAnalysis {
  tag: string;
  content: string | null;
  isOptimized: boolean;
}

export interface PerformanceData {
  lcp: number;
  fid: number;
  cls: number;
  overallPerformance: number;
}

export interface RobotsResult {
  exists: boolean;
  content?: string;
}

export interface SitemapResult {
  exists: boolean;
  content?: string;
}

export interface MetaDataAnalysis {
  metaTags: MetaTagAnalysis[];
  isAllOptimized: boolean;
}

export interface ContentAnalysis {
  keywordDensity: number;
  uniqueContent: boolean;
}

export interface LinkAnalysis {
  internalLinksCount: number;
  externalLinksCount: number;
  brokenLinks: string[];
}

export interface StructuredDataAnalysis {
  hasSchemaOrg: boolean;
  schemas: string[];
}

export interface AccessibilityAnalysis {
  accessibilityScore: number;
  issues: string[];
}

export interface BlockAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  correctCount: number;
  incorrectCount: number;
}

export interface SeoAnalysisDetails {
  technicalBlock: BlockAnalysisResult;
  metaBlock: BlockAnalysisResult;
  contentBlock: BlockAnalysisResult;
  linkBlock: BlockAnalysisResult;
}

export interface SeoAnalysisResult {
  metaTags: MetaTagAnalysis[];
  seoScore: number;
  overallScore: number;
  details: SeoAnalysisDetails;
}

export interface SeoState {
  lastResult: SeoAnalysisResult | null;
}
