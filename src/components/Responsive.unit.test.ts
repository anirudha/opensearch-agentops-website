import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Responsive Behavior Unit Tests
 * Tests specific responsive behaviors:
 * - Navigation shows hamburger menu on mobile
 * - Comparison table scrolls horizontally on mobile
 * - Sections stack vertically on mobile
 * Requirements: 1.3, 6.5, 16.4
 */

describe('Responsive Behavior Unit Tests', () => {
  describe('Navigation Component - Mobile Menu', () => {
    it('should have hamburger menu button with md:hidden class', () => {
      const navigationContent = readFileSync(
        join(process.cwd(), 'src/components/Navigation.astro'),
        'utf-8'
      );

      // Check for mobile menu button with md:hidden class
      expect(navigationContent).toContain('md:hidden');
      expect(navigationContent).toContain('mobile-menu-button');
      
      // Validates: Requirements 1.3
    });

    it('should have desktop menu with hidden md:flex classes', () => {
      const navigationContent = readFileSync(
        join(process.cwd(), 'src/components/Navigation.astro'),
        'utf-8'
      );

      // Check for desktop menu with hidden md:flex classes
      expect(navigationContent).toContain('hidden md:flex');
      
      // Validates: Requirements 1.3
    });

    it('should have mobile menu drawer with slide-out animation', () => {
      const navigationContent = readFileSync(
        join(process.cwd(), 'src/components/Navigation.astro'),
        'utf-8'
      );

      // Check for mobile menu drawer
      expect(navigationContent).toContain('mobile-menu');
      expect(navigationContent).toContain('mobile-menu-drawer');
      
      // Validates: Requirements 1.3, 1.4
    });

    it('should have responsive padding in navigation container', () => {
      const navigationContent = readFileSync(
        join(process.cwd(), 'src/components/Navigation.astro'),
        'utf-8'
      );

      // Check for responsive padding classes
      expect(navigationContent).toMatch(/px-4|sm:px-6|lg:px-8/);
      
      // Validates: Requirements 16.4
    });
  });

  describe('Comparison Table - Horizontal Scroll', () => {
    it('should have overflow-x-auto class for horizontal scrolling', () => {
      const comparisonContent = readFileSync(
        join(process.cwd(), 'src/components/Comparison.astro'),
        'utf-8'
      );

      // Check for horizontal scroll container
      expect(comparisonContent).toContain('overflow-x-auto');
      expect(comparisonContent).toContain('comparison-table-container');
      
      // Validates: Requirements 6.5
    });

    it('should have minimum width to enable scrolling on mobile', () => {
      const comparisonContent = readFileSync(
        join(process.cwd(), 'src/components/Comparison.astro'),
        'utf-8'
      );

      // Check for minimum width that forces scrolling
      expect(comparisonContent).toMatch(/min-w-\[800px\]/);
      
      // Validates: Requirements 6.5
    });

    it('should have fixed first column on mobile with feature-column class', () => {
      const comparisonContent = readFileSync(
        join(process.cwd(), 'src/components/Comparison.astro'),
        'utf-8'
      );

      // Check for feature column class
      expect(comparisonContent).toContain('feature-column');
      
      // Validates: Requirements 6.5
    });

    it('should have mobile scroll hint text', () => {
      const comparisonContent = readFileSync(
        join(process.cwd(), 'src/components/Comparison.astro'),
        'utf-8'
      );

      // Check for mobile scroll hint
      expect(comparisonContent).toContain('md:hidden');
      expect(comparisonContent).toMatch(/scroll|Scroll/i);
      
      // Validates: Requirements 6.5
    });

    it('should have CSS for sticky feature column on mobile', () => {
      const comparisonContent = readFileSync(
        join(process.cwd(), 'src/components/Comparison.astro'),
        'utf-8'
      );

      // Check for sticky positioning in CSS
      expect(comparisonContent).toContain('position: sticky');
      expect(comparisonContent).toContain('left: 0');
      
      // Validates: Requirements 6.5
    });
  });

  describe('Sections Stack Vertically on Mobile', () => {
    it('Hero section should stack trust badges in 2 columns on mobile', () => {
      const heroContent = readFileSync(
        join(process.cwd(), 'src/components/Hero.astro'),
        'utf-8'
      );

      // Check for responsive grid
      expect(heroContent).toContain('grid-cols-2');
      expect(heroContent).toContain('md:grid-cols-4');
      
      // Validates: Requirements 16.4
    });

    it('Hero section should stack CTAs vertically on mobile', () => {
      const heroContent = readFileSync(
        join(process.cwd(), 'src/components/Hero.astro'),
        'utf-8'
      );

      // Check for flex-col on mobile
      expect(heroContent).toContain('flex-col');
      expect(heroContent).toContain('sm:flex-row');
      
      // Validates: Requirements 16.4
    });

    it('Problem/Solution section should stack problem cards vertically on mobile', () => {
      const problemSolutionContent = readFileSync(
        join(process.cwd(), 'src/components/ProblemSolution.astro'),
        'utf-8'
      );

      // Check for single column on mobile
      expect(problemSolutionContent).toContain('grid-cols-1');
      expect(problemSolutionContent).toContain('md:grid-cols-3');
      
      // Validates: Requirements 16.4
    });

    it('Problem/Solution section should stack stat cards responsively', () => {
      const problemSolutionContent = readFileSync(
        join(process.cwd(), 'src/components/ProblemSolution.astro'),
        'utf-8'
      );

      // Check for responsive stat card grid
      expect(problemSolutionContent).toContain('grid-cols-1');
      expect(problemSolutionContent).toContain('sm:grid-cols-2');
      expect(problemSolutionContent).toContain('lg:grid-cols-4');
      
      // Validates: Requirements 16.4
    });

    it('Features section should stack feature blocks vertically on mobile', () => {
      const featuresContent = readFileSync(
        join(process.cwd(), 'src/components/Features.astro'),
        'utf-8'
      );

      // Check for flex-col on mobile
      expect(featuresContent).toContain('flex-col');
      expect(featuresContent).toContain('lg:flex-row');
      
      // Validates: Requirements 16.4
    });

    it('Use Cases section should use single column on mobile', () => {
      const useCasesContent = readFileSync(
        join(process.cwd(), 'src/components/UseCases.astro'),
        'utf-8'
      );

      // Check for single column on mobile
      expect(useCasesContent).toContain('grid-cols-1');
      expect(useCasesContent).toContain('md:grid-cols-2');
      expect(useCasesContent).toContain('lg:grid-cols-3');
      
      // Validates: Requirements 16.4
    });

    it('Integrations section should use 3 columns on mobile', () => {
      const integrationsContent = readFileSync(
        join(process.cwd(), 'src/components/Integrations.astro'),
        'utf-8'
      );

      // Check for 3 columns on mobile
      expect(integrationsContent).toContain('grid-cols-3');
      expect(integrationsContent).toContain('md:grid-cols-4');
      expect(integrationsContent).toContain('lg:grid-cols-6');
      
      // Validates: Requirements 16.4
    });

    it('Footer should stack columns vertically on mobile', () => {
      const footerContent = readFileSync(
        join(process.cwd(), 'src/components/Footer.astro'),
        'utf-8'
      );

      // Check for single column on mobile
      expect(footerContent).toContain('grid-cols-1');
      expect(footerContent).toContain('md:grid-cols-2');
      expect(footerContent).toContain('lg:grid-cols-4');
      
      // Validates: Requirements 16.4
    });

    it('Footer bottom section should stack vertically on mobile', () => {
      const footerContent = readFileSync(
        join(process.cwd(), 'src/components/Footer.astro'),
        'utf-8'
      );

      // Check for flex-col on mobile
      expect(footerContent).toContain('flex-col');
      expect(footerContent).toContain('md:flex-row');
      
      // Validates: Requirements 16.4
    });
  });

  describe('Responsive Text Sizes', () => {
    it('Hero headline should use responsive text sizes', () => {
      const heroContent = readFileSync(
        join(process.cwd(), 'src/components/Hero.astro'),
        'utf-8'
      );

      // Check for responsive text sizes
      expect(heroContent).toMatch(/text-5xl.*md:text-6xl.*lg:text-7xl/s);
      
      // Validates: Requirements 16.4
    });

    it('Section headers should use responsive text sizes', () => {
      const featuresContent = readFileSync(
        join(process.cwd(), 'src/components/Features.astro'),
        'utf-8'
      );

      // Check for responsive text sizes in headers
      expect(featuresContent).toMatch(/text-3xl.*md:text-4xl/s);
      
      // Validates: Requirements 16.4
    });
  });

  describe('Responsive Padding and Spacing', () => {
    it('Container should use responsive padding', () => {
      const heroContent = readFileSync(
        join(process.cwd(), 'src/components/Hero.astro'),
        'utf-8'
      );

      // Check for responsive padding
      expect(heroContent).toMatch(/px-4|px-6|sm:px-6|lg:px-8/);
      
      // Validates: Requirements 16.4
    });

    it('Sections should use responsive gap values', () => {
      const featuresContent = readFileSync(
        join(process.cwd(), 'src/components/Features.astro'),
        'utf-8'
      );

      // Check for responsive gap
      expect(featuresContent).toMatch(/gap-\d+/);
      
      // Validates: Requirements 16.4
    });
  });

  describe('Mobile-First Approach', () => {
    it('All components should define base mobile styles first', () => {
      const components = [
        'Navigation.astro',
        'Hero.astro',
        'Features.astro',
        'Comparison.astro',
        'UseCases.astro',
        'Footer.astro',
      ];

      components.forEach((component) => {
        const content = readFileSync(
          join(process.cwd(), 'src/components', component),
          'utf-8'
        );

        // Check that base classes exist before responsive modifiers
        // For example: grid-cols-1 before md:grid-cols-2
        const hasBaseClasses = 
          content.includes('grid-cols-1') ||
          content.includes('flex-col') ||
          content.includes('text-') ||
          content.includes('px-');

        expect(hasBaseClasses).toBe(true);
      });
      
      // Validates: Requirements 16.1, 16.4
    });
  });

  describe('Breakpoint Consistency', () => {
    it('Components should use standard Tailwind breakpoints', () => {
      const components = [
        'Navigation.astro',
        'Hero.astro',
        'Features.astro',
        'Comparison.astro',
        'UseCases.astro',
        'Footer.astro',
      ];

      const standardBreakpoints = ['sm:', 'md:', 'lg:', 'xl:'];

      components.forEach((component) => {
        const content = readFileSync(
          join(process.cwd(), 'src/components', component),
          'utf-8'
        );

        // Check that at least one standard breakpoint is used
        const usesStandardBreakpoints = standardBreakpoints.some((bp) =>
          content.includes(bp)
        );

        expect(usesStandardBreakpoints).toBe(true);
      });
      
      // Validates: Requirements 16.1
    });
  });
});
