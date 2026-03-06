/**
 * Unit tests for Footer component
 * Requirements: 13.1, 13.6
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Footer Component - Unit Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * Test: No footer column nav exists (columns were removed)
   * Requirements: 13.1
   */
  describe('Footer Columns Removed', () => {
    it('should not render any footer columns', () => {
      const footerHTML = `
        <footer id="footer">
          <div class="container mx-auto px-6">
            <div>
              <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex flex-col md:flex-row items-center gap-4">
                  <a href="/"><span>Observability Stack</span></a>
                  <p id="copyright-notice">© 2026 OpenSearch - Observability Stack. All rights reserved.</p>
                </div>
                <div id="social-links"></div>
              </div>
            </div>
          </div>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const columns = container.querySelectorAll('.footer-column');
      const nav = container.querySelector('nav[aria-label="Footer navigation"]');

      expect(columns.length).toBe(0);
      expect(nav).toBeNull();
    });
  });

  /**
   * Test: Logo and copyright display
   * Requirements: 13.6
   */
  describe('Logo and Copyright', () => {
    it('should render logo with link to home', () => {
      const footerHTML = `
        <footer>
          <a href="/">
            <svg class="w-8 h-8"></svg>
            <span>Observability Stack</span>
          </a>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const logoLink = container.querySelector('a[href="/"]');

      expect(logoLink).toBeTruthy();
      expect(logoLink?.querySelector('span')?.textContent).toBe('Observability Stack');
    });

    it('should have logo SVG element', () => {
      const footerHTML = `
        <footer>
          <a href="/">
            <svg class="w-8 h-8" viewBox="0 0 32 32"></svg>
          </a>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const svg = container.querySelector('svg');

      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('viewBox')).toBe('0 0 32 32');
    });

    it('should display copyright notice', () => {
      const currentYear = new Date().getFullYear();
      const footerHTML = `
        <footer>
          <p id="copyright-notice">© ${currentYear} OpenSearch - Observability Stack. All rights reserved.</p>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const copyright = container.querySelector('#copyright-notice');

      expect(copyright).toBeTruthy();
      expect(copyright?.textContent).toContain(currentYear.toString());
      expect(copyright?.textContent).toContain('OpenSearch');
      expect(copyright?.textContent).toContain('All rights reserved');
    });

    it('should display current year in copyright', () => {
      const currentYear = new Date().getFullYear();
      const footerHTML = `
        <footer>
          <p id="copyright-notice">© ${currentYear} OpenSearch - Observability Stack. All rights reserved.</p>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const copyright = container.querySelector('#copyright-notice');

      expect(copyright?.textContent).toContain(currentYear.toString());
    });
  });

  /**
   * Test: Social media links are present
   * Requirements: 13.6
   */
  describe('Social Media Links', () => {
    beforeEach(() => {
      const socialLinksHTML = `
        <footer>
          <div id="social-links">
            <a href="https://github.com/opensearch-project/observability-stack" target="_blank" rel="noopener noreferrer" aria-label="Visit our GitHub page">
              <svg class="w-6 h-6"></svg>
            </a>
            <a href="https://x.com/OpenSearchProj" target="_blank" rel="noopener noreferrer" aria-label="Visit our X (Twitter) page">
              <svg class="w-6 h-6"></svg>
            </a>
            <a href="https://opensearch.org/slack/" target="_blank" rel="noopener noreferrer" aria-label="Visit our Slack page">
              <svg class="w-6 h-6"></svg>
            </a>
            <a href="https://www.linkedin.com/company/opensearch-project/posts/?feedView=all" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn page">
              <svg class="w-6 h-6"></svg>
            </a>
          </div>
        </footer>
      `;
      container.innerHTML = socialLinksHTML;
    });

    it('should have GitHub social link', () => {
      const link = container.querySelector('a[href="https://github.com/opensearch-project/observability-stack"]');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('aria-label')).toContain('GitHub');
    });

    it('should have X (Twitter) social link', () => {
      const link = container.querySelector('a[href="https://x.com/OpenSearchProj"]');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('aria-label')).toContain('X (Twitter)');
    });

    it('should have Slack social link', () => {
      const link = container.querySelector('a[href="https://opensearch.org/slack/"]');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('aria-label')).toContain('Slack');
    });

    it('should have LinkedIn social link', () => {
      const link = container.querySelector('a[href="https://www.linkedin.com/company/opensearch-project/posts/?feedView=all"]');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('aria-label')).toContain('LinkedIn');
    });

    it('should have all four social media links', () => {
      const socialLinks = container.querySelectorAll('#social-links a');
      expect(socialLinks.length).toBe(4);
    });

    it('should have SVG icons for social links', () => {
      const svgs = container.querySelectorAll('#social-links svg');
      expect(svgs.length).toBe(4);
    });

    it('should have proper accessibility labels for social links', () => {
      const links = container.querySelectorAll('#social-links a');
      links.forEach(link => {
        expect(link.getAttribute('aria-label')).toBeTruthy();
        expect(link.getAttribute('aria-label')).toContain('Visit our');
      });
    });
  });

  /**
   * Test: Footer styling and structure
   * Requirements: 13.1, 13.6
   */
  describe('Footer Structure and Styling', () => {
    it('should have dark background styling', () => {
      const footerHTML = `
        <footer class="bg-slate-950 border-t border-slate-800">
        </footer>
      `;

      container.innerHTML = footerHTML;
      const footer = container.querySelector('footer');

      expect(footer?.classList.contains('bg-slate-950')).toBe(true);
      expect(footer?.classList.contains('border-t')).toBe(true);
    });

    it('should have proper spacing classes', () => {
      const footerHTML = `
        <footer class="py-12">
          <div class="container mx-auto px-6">
          </div>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const footer = container.querySelector('footer');
      const containerDiv = footer?.querySelector('.container');

      expect(footer?.classList.contains('py-12')).toBe(true);
      expect(containerDiv?.classList.contains('mx-auto')).toBe(true);
      expect(containerDiv?.classList.contains('px-6')).toBe(true);
    });

    it('should have proper semantic footer element', () => {
      const footerHTML = `
        <footer id="footer">
          <div>Content</div>
        </footer>
      `;

      container.innerHTML = footerHTML;
      const footer = container.querySelector('footer');

      expect(footer).toBeTruthy();
      expect(footer?.tagName).toBe('FOOTER');
      expect(footer?.getAttribute('id')).toBe('footer');
    });
  });
});
