import { GlobalWing } from '@/lib/chrome-wings';
import {
  runAudit,
  extractIssues,
  summarizeResults,
  highlightIssues,
  clearHighlights,
  scrollToIssue,
} from '@/src/logic/accessibility';
import {
  AccessibilityIssue,
  AccessibilitySummary,
} from '@/src/services/accessibility-service/types';

interface AccessibilityState {
  issues: AccessibilityIssue[];
  summary: AccessibilitySummary | null;
}

class AccessibilityGlobalService extends GlobalWing<AccessibilityState> {
  constructor() {
    super('Accessibility', {
      issues: [],
      summary: null,
    });
  }

  public async audit(): Promise<void> {
    const results = await runAudit();
    const issues = extractIssues(results);
    const summary = summarizeResults(results);

    this.setState({ issues, summary });
  }

  public highlightCurrentIssues(): void {
    highlightIssues(this.state.issues);
  }

  public clearIssueHighlights(): void {
    clearHighlights();
  }

  public scrollTo(index: number): void {
    const issue = this.state.issues.find((i) => i.index === index);
    if (issue) scrollToIssue(issue);
  }
}

const accessibilityGlobalService = new AccessibilityGlobalService();
export { accessibilityGlobalService as AccessibilityGlobalService };
