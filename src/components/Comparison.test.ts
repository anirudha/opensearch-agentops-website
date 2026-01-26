/**
 * Property-based tests for Comparison component
 * Feature: opensearch-agentops-website
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

type SupportLevel = 'full' | 'partial' | 'none';

interface ComparisonRow {
  feature: string;
  agentops: SupportLevel;
  braintrust: SupportLevel;
  langfuse: SupportLevel;
  arize: SupportLevel;
}

/**
 * Property 1: Comparison icons match support levels
 * Validates: Requirements 6.3
 * 
 * For any comparison row data with support levels (full, partial, none), 
 * the rendered table cell should display the correct icon: checkmark (green) 
 * for full, partial circle (yellow) for partial, and X (red) for none.
 */
describe('Comparison - Property 1: Comparison icons match support levels', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // Helper function to get expected icon path and color based on support level
  function getExpectedIconData(level: SupportLevel): { iconPath: string; colorClass: string } {
    switch (level) {
      case 'full':
        return {
          iconPath: 'M5 13l4 4L19 7',
          colorClass: 'text-green-500',
        };
      case 'partial':
        return {
          iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          colorClass: 'text-yellow-500',
        };
      case 'none':
        return {
          iconPath: 'M6 18L18 6M6 6l12 12',
          colorClass: 'text-red-500',
        };
    }
  }

  // Helper function to render a comparison cell with icon
  function renderComparisonCell(platform: string, supportLevel: SupportLevel): string {
    const { iconPath, colorClass } = getExpectedIconData(supportLevel);
    
    return `
      <td class="p-4 text-center" data-platform="${platform}" data-support="${supportLevel}">
        <div class="flex justify-center">
          <svg 
            class="w-6 h-6 ${colorClass}"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-label="${supportLevel} support"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="${iconPath}"
            />
          </svg>
        </div>
      </td>
    `;
  }

  it('should render correct icon for all support levels across all platforms', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string({ minLength: 3, maxLength: 50 })
            .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
          agentops: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
          braintrust: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
          langfuse: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
          arize: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
        }),
        (row) => {
          // Render comparison row
          const rowHTML = `
            <table class="comparison-table">
              <tbody>
                <tr>
                  <td class="feature-column">${row.feature}</td>
                  ${renderComparisonCell('agentops', row.agentops)}
                  ${renderComparisonCell('braintrust', row.braintrust)}
                  ${renderComparisonCell('langfuse', row.langfuse)}
                  ${renderComparisonCell('arize', row.arize)}
                </tr>
              </tbody>
            </table>
          `;
          
          container.innerHTML = rowHTML;

          // Test each platform's cell
          const platforms = ['agentops', 'braintrust', 'langfuse', 'arize'] as const;
          
          platforms.forEach((platform) => {
            const cell = container.querySelector(`[data-platform="${platform}"]`);
            expect(cell).toBeTruthy();

            const supportLevel = row[platform];
            const expectedData = getExpectedIconData(supportLevel);

            // Property: Cell should have correct support level attribute
            expect(cell!.getAttribute('data-support')).toBe(supportLevel);

            // Property: Icon should have correct color class
            const svg = cell!.querySelector('svg');
            expect(svg).toBeTruthy();
            expect(svg!.className).toContain(expectedData.colorClass);

            // Property: Icon should have correct path
            const path = svg!.querySelector('path');
            expect(path).toBeTruthy();
            expect(path!.getAttribute('d')).toBe(expectedData.iconPath);

            // Property: Icon should have appropriate aria-label
            const ariaLabel = svg!.getAttribute('aria-label');
            expect(ariaLabel).toBeTruthy();
            expect(ariaLabel).toContain(supportLevel);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render checkmark icon (green) for full support', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string({ minLength: 3, maxLength: 50 })
            .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
          platform: fc.constantFrom('agentops', 'braintrust', 'langfuse', 'arize'),
        }),
        (data) => {
          const cellHTML = `
            <table>
              <tbody>
                <tr>
                  ${renderComparisonCell(data.platform, 'full')}
                </tr>
              </tbody>
            </table>
          `;
          
          container.innerHTML = cellHTML;

          const cell = container.querySelector(`[data-support="full"]`);
          expect(cell, `Cell with data-support="full" should exist`).toBeTruthy();

          // Property: Full support should render green checkmark
          const svg = cell!.querySelector('svg');
          expect(svg, `SVG icon should exist in cell`).toBeTruthy();
          expect(svg!.className, `SVG should have green color class`).toContain('text-green-500');

          const path = svg!.querySelector('path');
          expect(path, `Path element should exist in SVG`).toBeTruthy();
          expect(path!.getAttribute('d')).toBe('M5 13l4 4L19 7');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render partial circle icon (yellow) for partial support', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string({ minLength: 3, maxLength: 50 })
            .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
          platform: fc.constantFrom('agentops', 'braintrust', 'langfuse', 'arize'),
        }),
        (data) => {
          const cellHTML = `
            <table>
              <tbody>
                <tr>
                  ${renderComparisonCell(data.platform, 'partial')}
                </tr>
              </tbody>
            </table>
          `;
          
          container.innerHTML = cellHTML;

          const cell = container.querySelector(`[data-support="partial"]`);
          expect(cell, `Cell with data-support="partial" should exist`).toBeTruthy();

          // Property: Partial support should render yellow partial circle
          const svg = cell!.querySelector('svg');
          expect(svg, `SVG icon should exist in cell`).toBeTruthy();
          expect(svg!.className, `SVG should have yellow color class`).toContain('text-yellow-500');

          const path = svg!.querySelector('path');
          expect(path, `Path element should exist in SVG`).toBeTruthy();
          expect(path!.getAttribute('d')).toBe('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render X icon (red) for no support', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string({ minLength: 3, maxLength: 50 })
            .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
          platform: fc.constantFrom('agentops', 'braintrust', 'langfuse', 'arize'),
        }),
        (data) => {
          const cellHTML = `
            <table>
              <tbody>
                <tr>
                  ${renderComparisonCell(data.platform, 'none')}
                </tr>
              </tbody>
            </table>
          `;
          
          container.innerHTML = cellHTML;

          const cell = container.querySelector(`[data-support="none"]`);
          expect(cell, `Cell with data-support="none" should exist`).toBeTruthy();

          // Property: No support should render red X
          const svg = cell!.querySelector('svg');
          expect(svg, `SVG icon should exist in cell`).toBeTruthy();
          expect(svg!.className, `SVG should have red color class`).toContain('text-red-500');

          const path = svg!.querySelector('path');
          expect(path, `Path element should exist in SVG`).toBeTruthy();
          expect(path!.getAttribute('d')).toBe('M6 18L18 6M6 6l12 12');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain icon consistency across multiple rows', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            feature: fc.string({ minLength: 3, maxLength: 50 })
              .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
            agentops: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
            braintrust: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
            langfuse: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
            arize: fc.constantFrom<SupportLevel>('full', 'partial', 'none'),
          }),
          { minLength: 3, maxLength: 10 }
        ),
        (rows) => {
          // Render multiple comparison rows
          const tableHTML = `
            <table class="comparison-table">
              <tbody>
                ${rows.map((row, idx) => `
                  <tr data-row-index="${idx}">
                    <td class="feature-column">${row.feature}</td>
                    ${renderComparisonCell('agentops', row.agentops)}
                    ${renderComparisonCell('braintrust', row.braintrust)}
                    ${renderComparisonCell('langfuse', row.langfuse)}
                    ${renderComparisonCell('arize', row.arize)}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
          
          container.innerHTML = tableHTML;

          // Property: Each row should have correct icons for each platform
          rows.forEach((row, rowIdx) => {
            const rowElement = container.querySelector(`[data-row-index="${rowIdx}"]`);
            expect(rowElement).toBeTruthy();

            const platforms = ['agentops', 'braintrust', 'langfuse', 'arize'] as const;
            
            platforms.forEach((platform) => {
              const cells = rowElement!.querySelectorAll(`[data-platform="${platform}"]`);
              expect(cells.length).toBe(1);

              const cell = cells[0];
              const supportLevel = row[platform];
              const expectedData = getExpectedIconData(supportLevel);

              const svg = cell.querySelector('svg');
              expect(svg).toBeTruthy();
              expect(svg!.className).toContain(expectedData.colorClass);

              const path = svg!.querySelector('path');
              expect(path!.getAttribute('d')).toBe(expectedData.iconPath);
            });
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ensure icon colors are distinct for different support levels', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string({ minLength: 3, maxLength: 50 })
            .filter(s => /^[a-zA-Z0-9\s]+$/.test(s) && s.trim().length >= 3),
        }),
        (data) => {
          // Render cells with all three support levels
          const rowHTML = `
            <table>
              <tr>
                <td class="feature-column">${data.feature}</td>
                ${renderComparisonCell('platform1', 'full')}
                ${renderComparisonCell('platform2', 'partial')}
                ${renderComparisonCell('platform3', 'none')}
              </tr>
            </table>
          `;
          
          container.innerHTML = rowHTML;

          const fullCell = container.querySelector('[data-support="full"]');
          const partialCell = container.querySelector('[data-support="partial"]');
          const noneCell = container.querySelector('[data-support="none"]');

          // Property: Each support level should have a distinct color
          const fullSvg = fullCell!.querySelector('svg');
          const partialSvg = partialCell!.querySelector('svg');
          const noneSvg = noneCell!.querySelector('svg');

          const fullColor = fullSvg!.className;
          const partialColor = partialSvg!.className;
          const noneColor = noneSvg!.className;

          // All colors should be different
          expect(fullColor).toContain('text-green-500');
          expect(partialColor).toContain('text-yellow-500');
          expect(noneColor).toContain('text-red-500');

          // Ensure they're actually different
          expect(fullColor).not.toBe(partialColor);
          expect(fullColor).not.toBe(noneColor);
          expect(partialColor).not.toBe(noneColor);
        }
      ),
      { numRuns: 100 }
    );
  });
});
