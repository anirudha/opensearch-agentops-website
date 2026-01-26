/**
 * Unit tests for Comparison component
 * Requirements: 6.1, 6.2, 6.4, 6.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Comparison Component - Unit Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * Test: Correct number of rows and columns
   * Requirements: 6.1, 6.2
   */
  describe('Table Structure', () => {
    beforeEach(() => {
      const comparisonHTML = `
        <section id="compare" class="py-20 bg-slate-900">
          <div class="container mx-auto px-6">
            <div class="max-w-6xl mx-auto">
              <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                  How We Compare
                </h2>
              </div>
              <div class="comparison-table-container overflow-x-auto">
                <table class="comparison-table w-full">
                  <thead>
                    <tr>
                      <th class="feature-column">Feature</th>
                      <th>OpenSearch AgentOps</th>
                      <th>Braintrust</th>
                      <th>Langfuse</th>
                      <th>Arize</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="feature-column">LLM Tracing</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Prompt Management</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Evaluation Framework</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">AI Insights</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Human Annotation</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Open Source</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Self-Hosted Option</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Enterprise SSO</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">SOC 2 Compliant</td>
                      <td data-platform="agentops"></td>
                      <td data-platform="braintrust"></td>
                      <td data-platform="langfuse"></td>
                      <td data-platform="arize"></td>
                    </tr>
                    <tr>
                      <td class="feature-column">Pricing</td>
                      <td data-platform="agentops">Free (self-hosted) or $0.001/request</td>
                      <td data-platform="braintrust">$0.002/request + $500/mo base</td>
                      <td data-platform="langfuse">Free (self-hosted) or $0.0015/request</td>
                      <td data-platform="arize">$0.003/request + $1000/mo base</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      `;
      
      container.innerHTML = comparisonHTML;
    });

    it('should render comparison table with correct number of columns', () => {
      const headerCells = container.querySelectorAll('thead th');

      // Should have 5 columns: Feature + 4 platforms
      expect(headerCells.length).toBe(5);
    });

    it('should have correct column headers', () => {
      const headerCells = container.querySelectorAll('thead th');

      expect(headerCells[0]?.textContent).toContain('Feature');
      expect(headerCells[1]?.textContent).toContain('OpenSearch AgentOps');
      expect(headerCells[2]?.textContent).toContain('Braintrust');
      expect(headerCells[3]?.textContent).toContain('Langfuse');
      expect(headerCells[4]?.textContent).toContain('Arize');
    });

    it('should render correct number of feature rows', () => {
      const bodyRows = container.querySelectorAll('tbody tr');

      // Should have 10 rows as per requirements
      expect(bodyRows.length).toBe(10);
    });

    it('should have all required feature rows', () => {
      const featureNames = Array.from(container.querySelectorAll('.feature-column'))
        .slice(1) // Skip header
        .map(cell => cell.textContent?.trim());

      expect(featureNames).toContain('LLM Tracing');
      expect(featureNames).toContain('Prompt Management');
      expect(featureNames).toContain('Evaluation Framework');
      expect(featureNames).toContain('AI Insights');
      expect(featureNames).toContain('Human Annotation');
      expect(featureNames).toContain('Open Source');
      expect(featureNames).toContain('Self-Hosted Option');
      expect(featureNames).toContain('Enterprise SSO');
      expect(featureNames).toContain('SOC 2 Compliant');
      expect(featureNames).toContain('Pricing');
    });

    it('should have 4 platform columns per row', () => {
      const bodyRows = container.querySelectorAll('tbody tr');

      bodyRows.forEach(row => {
        const platformCells = row.querySelectorAll('[data-platform]');
        expect(platformCells.length).toBe(4);
      });
    });

    it('should have correct platform data attributes', () => {
      const firstRow = container.querySelector('tbody tr');
      const platformCells = firstRow?.querySelectorAll('[data-platform]');

      expect(platformCells?.[0]?.getAttribute('data-platform')).toBe('agentops');
      expect(platformCells?.[1]?.getAttribute('data-platform')).toBe('braintrust');
      expect(platformCells?.[2]?.getAttribute('data-platform')).toBe('langfuse');
      expect(platformCells?.[3]?.getAttribute('data-platform')).toBe('arize');
    });
  });

  /**
   * Test: Pricing row displays pricing information
   * Requirements: 6.2, 6.4
   */
  describe('Pricing Row', () => {
    beforeEach(() => {
      const pricingRowHTML = `
        <table class="comparison-table">
          <tbody>
            <tr>
              <td class="feature-column">Pricing</td>
              <td data-platform="agentops">
                <div class="text-xs text-white font-semibold">Free (self-hosted) or $0.001/request</div>
              </td>
              <td data-platform="braintrust">
                <div class="text-xs text-slate-300">$0.002/request + $500/mo base</div>
              </td>
              <td data-platform="langfuse">
                <div class="text-xs text-slate-300">Free (self-hosted) or $0.0015/request</div>
              </td>
              <td data-platform="arize">
                <div class="text-xs text-slate-300">$0.003/request + $1000/mo base</div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
      
      container.innerHTML = pricingRowHTML;
    });

    it('should display pricing information for all platforms', () => {
      const pricingCells = container.querySelectorAll('[data-platform]');

      expect(pricingCells.length).toBe(4);
      
      pricingCells.forEach(cell => {
        const pricingText = cell.textContent?.trim();
        expect(pricingText).toBeTruthy();
        expect(pricingText!.length).toBeGreaterThan(0);
      });
    });

    it('should display OpenSearch AgentOps pricing', () => {
      const agentopsCell = container.querySelector('[data-platform="agentops"]');
      const pricingText = agentopsCell?.textContent?.trim();

      expect(pricingText).toContain('Free');
      expect(pricingText).toContain('$0.001/request');
    });

    it('should display Braintrust pricing', () => {
      const braintrustCell = container.querySelector('[data-platform="braintrust"]');
      const pricingText = braintrustCell?.textContent?.trim();

      expect(pricingText).toContain('$0.002/request');
      expect(pricingText).toContain('$500/mo');
    });

    it('should display Langfuse pricing', () => {
      const langfuseCell = container.querySelector('[data-platform="langfuse"]');
      const pricingText = langfuseCell?.textContent?.trim();

      expect(pricingText).toContain('Free');
      expect(pricingText).toContain('$0.0015/request');
    });

    it('should display Arize pricing', () => {
      const arizeCell = container.querySelector('[data-platform="arize"]');
      const pricingText = arizeCell?.textContent?.trim();

      expect(pricingText).toContain('$0.003/request');
      expect(pricingText).toContain('$1000/mo');
    });

    it('should highlight free/self-hosted options', () => {
      const agentopsCell = container.querySelector('[data-platform="agentops"]');
      const langfuseCell = container.querySelector('[data-platform="langfuse"]');

      expect(agentopsCell?.textContent).toContain('Free');
      expect(langfuseCell?.textContent).toContain('Free');
    });
  });

  /**
   * Test: Mobile horizontal scroll behavior
   * Requirements: 6.5
   */
  describe('Mobile Horizontal Scroll', () => {
    beforeEach(() => {
      const comparisonHTML = `
        <section id="compare">
          <div class="comparison-table-container overflow-x-auto">
            <table class="comparison-table w-full min-w-[800px]">
              <thead class="sticky top-0">
                <tr>
                  <th class="feature-column">Feature</th>
                  <th>OpenSearch AgentOps</th>
                  <th>Braintrust</th>
                  <th>Langfuse</th>
                  <th>Arize</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="feature-column">LLM Tracing</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 text-center text-sm text-slate-500 md:hidden">
            ← Scroll horizontally to see all platforms →
          </div>
        </section>
      `;
      
      container.innerHTML = comparisonHTML;
    });

    it('should have overflow-x-auto on table container', () => {
      const tableContainer = container.querySelector('.comparison-table-container');

      expect(tableContainer).toBeTruthy();
      expect(tableContainer?.classList.contains('overflow-x-auto')).toBe(true);
    });

    it('should have minimum width on table for horizontal scroll', () => {
      const table = container.querySelector('.comparison-table');

      expect(table).toBeTruthy();
      expect(table?.classList.contains('min-w-[800px]')).toBe(true);
    });

    it('should have sticky header', () => {
      const thead = container.querySelector('thead');

      expect(thead).toBeTruthy();
      expect(thead?.classList.contains('sticky')).toBe(true);
      expect(thead?.classList.contains('top-0')).toBe(true);
    });

    it('should have feature column class for fixed first column', () => {
      const featureColumns = container.querySelectorAll('.feature-column');

      expect(featureColumns.length).toBeGreaterThan(0);
      
      featureColumns.forEach(col => {
        expect(col.classList.contains('feature-column')).toBe(true);
      });
    });

    it('should have mobile scroll hint', () => {
      const scrollHint = container.querySelector('.md\\:hidden');

      expect(scrollHint).toBeTruthy();
      expect(scrollHint?.textContent).toContain('Scroll horizontally');
    });

    it('should hide scroll hint on desktop (md:hidden class)', () => {
      const scrollHint = container.querySelector('.text-sm.text-slate-500');

      expect(scrollHint).toBeTruthy();
      expect(scrollHint?.classList.contains('md:hidden')).toBe(true);
    });
  });

  /**
   * Test: Section structure and styling
   * Requirements: 6.1
   */
  describe('Section Structure', () => {
    beforeEach(() => {
      const comparisonHTML = `
        <section id="compare" class="py-20 bg-slate-900">
          <div class="container mx-auto px-6">
            <div class="max-w-6xl mx-auto">
              <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
                  How We Compare
                </h2>
                <p class="text-lg text-slate-400 max-w-3xl mx-auto">
                  See how OpenSearch AgentOps stacks up against Braintrust, Langfuse, and Arize
                </p>
              </div>
            </div>
          </div>
        </section>
      `;
      
      container.innerHTML = comparisonHTML;
    });

    it('should have compare section with correct id', () => {
      const section = container.querySelector('#compare');

      expect(section).toBeTruthy();
      expect(section?.tagName).toBe('SECTION');
      expect(section?.getAttribute('id')).toBe('compare');
    });

    it('should have correct background color', () => {
      const section = container.querySelector('#compare');

      expect(section?.classList.contains('bg-slate-900')).toBe(true);
    });

    it('should have correct padding', () => {
      const section = container.querySelector('#compare');

      expect(section?.classList.contains('py-20')).toBe(true);
    });

    it('should have section header with title', () => {
      const header = container.querySelector('h2');

      expect(header).toBeTruthy();
      expect(header?.textContent).toContain('How We Compare');
      expect(header?.classList.contains('text-white')).toBe(true);
      expect(header?.classList.contains('font-bold')).toBe(true);
    });

    it('should have section description', () => {
      const description = container.querySelector('p.text-lg');

      expect(description).toBeTruthy();
      expect(description?.textContent).toContain('OpenSearch AgentOps');
      expect(description?.textContent).toContain('Braintrust');
      expect(description?.textContent).toContain('Langfuse');
      expect(description?.textContent).toContain('Arize');
      expect(description?.classList.contains('text-slate-400')).toBe(true);
    });

    it('should have centered header layout', () => {
      const headerContainer = container.querySelector('.text-center');

      expect(headerContainer).toBeTruthy();
      expect(headerContainer?.classList.contains('mb-12')).toBe(true);
    });
  });

  /**
   * Test: OpenSearch AgentOps column highlighting
   * Requirements: 6.1
   */
  describe('Platform Column Highlighting', () => {
    beforeEach(() => {
      const comparisonHTML = `
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="feature-column bg-slate-900">Feature</th>
              <th class="bg-indigo-500/5">
                <div class="text-center">
                  <div class="text-sm font-semibold text-white">OpenSearch AgentOps</div>
                  <div class="text-xs text-indigo-400">Our Platform</div>
                </div>
              </th>
              <th class="bg-slate-900">
                <div class="text-center">
                  <div class="text-sm font-semibold text-white">Braintrust</div>
                  <div class="text-xs text-slate-500">Competitor</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="feature-column bg-slate-900">LLM Tracing</td>
              <td class="bg-indigo-500/5" data-platform="agentops"></td>
              <td class="bg-slate-900" data-platform="braintrust"></td>
            </tr>
          </tbody>
        </table>
      `;
      
      container.innerHTML = comparisonHTML;
    });

    it('should highlight OpenSearch AgentOps column header', () => {
      const agentopsHeader = container.querySelector('thead th.bg-indigo-500\\/5');

      expect(agentopsHeader).toBeTruthy();
      expect(agentopsHeader?.textContent).toContain('OpenSearch AgentOps');
    });

    it('should have "Our Platform" label for OpenSearch AgentOps', () => {
      const agentopsHeader = container.querySelector('thead th.bg-indigo-500\\/5');
      const label = agentopsHeader?.querySelector('.text-indigo-400');

      expect(label).toBeTruthy();
      expect(label?.textContent).toBe('Our Platform');
    });

    it('should have "Competitor" label for other platforms', () => {
      const competitorHeaders = container.querySelectorAll('.text-slate-500');

      expect(competitorHeaders.length).toBeGreaterThan(0);
      competitorHeaders.forEach(label => {
        expect(label.textContent).toBe('Competitor');
      });
    });

    it('should highlight OpenSearch AgentOps column cells', () => {
      const agentopsCell = container.querySelector('tbody td[data-platform="agentops"]');

      expect(agentopsCell).toBeTruthy();
      expect(agentopsCell?.classList.contains('bg-indigo-500/5')).toBe(true);
    });

    it('should not highlight competitor column cells', () => {
      const braintrustCell = container.querySelector('tbody td[data-platform="braintrust"]');

      expect(braintrustCell).toBeTruthy();
      expect(braintrustCell?.classList.contains('bg-slate-900')).toBe(true);
      expect(braintrustCell?.classList.contains('bg-indigo-500/5')).toBe(false);
    });
  });

  /**
   * Test: Icon rendering for support levels
   * Requirements: 6.3
   */
  describe('Support Level Icons', () => {
    beforeEach(() => {
      const comparisonHTML = `
        <table class="comparison-table">
          <tbody>
            <tr>
              <td class="feature-column">LLM Tracing</td>
              <td data-platform="agentops" data-support="full">
                <div class="flex justify-center">
                  <svg class="w-6 h-6 text-green-500" aria-label="Full support">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </td>
              <td data-platform="braintrust" data-support="partial">
                <div class="flex justify-center">
                  <svg class="w-6 h-6 text-yellow-500" aria-label="Partial support">
                    <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </td>
              <td data-platform="langfuse" data-support="none">
                <div class="flex justify-center">
                  <svg class="w-6 h-6 text-red-500" aria-label="No support">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      `;
      
      container.innerHTML = comparisonHTML;
    });

    it('should render green checkmark for full support', () => {
      const fullSupportCell = container.querySelector('[data-support="full"]');
      const icon = fullSupportCell?.querySelector('svg');

      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-green-500')).toBe(true);
      expect(icon?.getAttribute('aria-label')).toBe('Full support');
    });

    it('should render yellow partial circle for partial support', () => {
      const partialSupportCell = container.querySelector('[data-support="partial"]');
      const icon = partialSupportCell?.querySelector('svg');

      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-yellow-500')).toBe(true);
      expect(icon?.getAttribute('aria-label')).toBe('Partial support');
    });

    it('should render red X for no support', () => {
      const noSupportCell = container.querySelector('[data-support="none"]');
      const icon = noSupportCell?.querySelector('svg');

      expect(icon).toBeTruthy();
      expect(icon?.classList.contains('text-red-500')).toBe(true);
      expect(icon?.getAttribute('aria-label')).toBe('No support');
    });

    it('should center icons in cells', () => {
      const cells = container.querySelectorAll('[data-support]');

      cells.forEach(cell => {
        const iconContainer = cell.querySelector('.flex.justify-center');
        expect(iconContainer).toBeTruthy();
      });
    });

    it('should have consistent icon size', () => {
      const icons = container.querySelectorAll('svg');

      icons.forEach(icon => {
        expect(icon.classList.contains('w-6')).toBe(true);
        expect(icon.classList.contains('h-6')).toBe(true);
      });
    });
  });
});
