import { LocalWing } from '@/lib/chrome-wings';
import { useWing } from '@/lib/react-wings';
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
  AccessibilityState
} from '@/src/services/accessibility-service/types';

class AccessibilityLocalService extends LocalWing<AccessibilityState> {
  constructor() {
    super('Accessibility', {
      issues: [],
      summary: null,
    });

    this.actions.audit = this.audit.bind(this);
    this.actions.highlightCurrentIssues = this.highlightCurrentIssues.bind(this);
    this.actions.clearIssueHighlights = this.clearIssueHighlights.bind(this);
    this.actions.scrollTo = this.scrollTo.bind(this);
  }

  public async audit(): Promise<{ issues: AccessibilityIssue[]; summary: AccessibilitySummary | null }> {
    const results = await runAudit();
    const issues = extractIssues(results);
    const summary = summarizeResults(results);

    this.setState({ issues, summary });
    return { issues, summary };
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

const accessibilityLocalService = new AccessibilityLocalService();
export { accessibilityLocalService as AccessibilityLocalService, useWing as useAccessibility };
