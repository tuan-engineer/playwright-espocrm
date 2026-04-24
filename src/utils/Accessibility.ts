// pages/AxePage.ts
import { type Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result, RunOptions } from 'axe-core';

export const WCAG_TAGS = {
  AA: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  AAA: ['wcag2a', 'wcag2aa', 'wcag21aaa', 'wcag21a', 'wcag21aa'],
  BEST_PRACTICE: ['best-practice'],
  SECTION_508: ['section508'],
} as const;

export class Accessibility {
  constructor(private readonly page: Page) {}
  /** Scan entire page without filters */
  async scanFullPage(): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page }).analyze();
  }
  /** Scan with WCAG tags (default: AA) */
  async scanWithTags(tags: readonly string[] = WCAG_TAGS['AA']): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page }).withTags([...tags]).analyze();
  }
  /** Scan using specific rule IDs */
  async scanWithRules(ruleIds: string | string[]): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page })
      .withRules(Array.isArray(ruleIds) ? ruleIds : [ruleIds])
      .analyze();
  }
  /** Scan a specific element by selector */
  async scanElement(selector: string): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page }).include(selector).analyze();
  }
  /** Scan element with WCAG tags */
  async scanElementWithTags(
    selector: string,
    tags: readonly string[] = WCAG_TAGS['AA'],
  ): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page })
      .include(selector)
      .withTags([...tags])
      .analyze();
  }
  /** Scan page excluding specific selectors */
  async scanExcluding(excludeSelectors: string[]): Promise<AxeResults> {
    let builder = new AxeBuilder({ page: this.page });
    for (const sel of excludeSelectors) {
      builder = builder.exclude(sel);
    }
    return await builder.analyze();
  }
  /** Scan with disabled rules */
  async scanDisablingRules(ruleIds: string | string[]): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page })
      .disableRules(Array.isArray(ruleIds) ? ruleIds : [ruleIds])
      .analyze();
  }
  /** Scan with full Axe options override */
  async scanWithOptions(options: RunOptions): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page }).options(options).analyze();
  }
  /** Enable legacy mode for cross-origin support */
  async scanLegacyMode(): Promise<AxeResults> {
    return await new AxeBuilder({ page: this.page }).setLegacyMode(true).analyze();
  }
  /** Expect no accessibility violations */
  async expectNoViolations(results?: AxeResults): Promise<void> {
    const r = results ?? (await this.scanFullPage());
    expect(r.violations).toEqual([]);
  }
  /** Expect no WCAG AA violations */
  async expectNoWcagAAViolations(): Promise<void> {
    const r = await this.scanWithTags(WCAG_TAGS.AA);
    expect(r.violations).toEqual([]);
  }
  /** Expect a specific rule is not violated */
  async expectViolationAbsent(ruleId: string): Promise<void> {
    const r = await this.scanFullPage();
    const found = r.violations.some((v) => v.id === ruleId);
    expect(found, `Rule "${ruleId}" should not be violated`).toBe(false);
  }
  /** Log violations in a readable table */
  logViolations(results: AxeResults): void {
    const { violations } = results;
    if (violations.length === 0) {
      console.log('No accessibility violations found.');
      return;
    }
    console.log(`\n${violations.length} accessibility violation(s):\n`);
    console.table(
      violations.map(({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        affectedNodes: nodes.length,
      })),
    );
  }
  /** Get all violation IDs */
  getViolationIds(results: AxeResults): string[] {
    return results.violations.map((v) => v.id);
  }
  /** Filter violations by impact level */
  getViolationsByImpact(results: AxeResults, impact: Result['impact']): Result[] {
    return results.violations.filter((v) => v.impact === impact);
  }
}
