import { ComponentType, ReactNode } from 'react';

export interface RefactorOptions {
  extractComponents?: boolean;
  improveTypes?: boolean;
  optimizePerformance?: boolean;
  organizeImports?: boolean;
  addErrorBoundaries?: boolean;
}

export interface ComponentAnalysis {
  name: string;
  complexity: number;
  propsCount: number;
  hasState: boolean;
  hasEffects: boolean;
  hasCustomHooks: boolean;
  suggestions: string[];
}

export interface RefactorResult {
  success: boolean;
  message: string;
  changes: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Main refactor utility class
 */
export class RefactorTool {
  private options: RefactorOptions;

  constructor(options: RefactorOptions = {}) {
    this.options = {
      extractComponents: true,
      improveTypes: true,
      optimizePerformance: true,
      organizeImports: true,
      addErrorBoundaries: true,
      ...options
    };
  }

  /**
   * Analyze a component for refactoring opportunities
   */
  analyzeComponent(componentCode: string): ComponentAnalysis {
    const lines = componentCode.split('\n');
    let complexity = 0;
    let hasState = false;
    let hasEffects = false;
    let hasCustomHooks = false;
    let propsCount = 0;

    // Simple complexity analysis
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('useState')) hasState = true;
      if (trimmed.includes('useEffect')) hasEffects = true;
      if (trimmed.includes('use')) hasCustomHooks = true;
      if (trimmed.includes('if') || trimmed.includes('for') || trimmed.includes('while')) complexity++;
      if (trimmed.includes('props.')) propsCount++;
    }

    const suggestions: string[] = [];
    
    if (complexity > 5) suggestions.push('Consider breaking down complex logic into smaller functions');
    if (propsCount > 5) suggestions.push('Consider grouping related props into objects');
    if (hasState && hasEffects) suggestions.push('Consider using custom hooks to manage related state and effects');
    if (lines.length > 100) suggestions.push('Component is quite large, consider extracting sub-components');

    return {
      name: 'Component',
      complexity,
      propsCount,
      hasState,
      hasEffects,
      hasCustomHooks,
      suggestions
    };
  }

  /**
   * Extract reusable components from a large component
   */
  extractComponents(componentCode: string, componentName: string): string[] {
    const extracted: string[] = [];
    
    // Look for repeated JSX patterns
    const jsxPatterns = this.findJSXPatterns(componentCode);
    
    jsxPatterns.forEach((pattern, index) => {
      const componentName = `ExtractedComponent${index + 1}`;
      const extractedComponent = this.createExtractedComponent(componentName, pattern);
      extracted.push(extractedComponent);
    });

    return extracted;
  }

  /**
   * Improve TypeScript types in the code
   */
  improveTypes(code: string): string {
    let improvedCode = code;

    // Add proper typing for event handlers
    improvedCode = improvedCode.replace(
      /onClick=\{([^}]+)\}/g,
      'onClick={(e: React.MouseEvent<HTMLButtonElement>) => $1}'
    );

    // Add proper typing for form events
    improvedCode = improvedCode.replace(
      /onSubmit=\{([^}]+)\}/g,
      'onSubmit={(e: React.FormEvent<HTMLFormElement>) => $1}'
    );

    // Add proper typing for input changes
    improvedCode = improvedCode.replace(
      /onChange=\{([^}]+)\}/g,
      'onChange={(e: React.ChangeEvent<HTMLInputElement>) => $1}'
    );

    return improvedCode;
  }

  /**
   * Optimize performance by adding memoization and other optimizations
   */
  optimizePerformance(code: string): string {
    let optimizedCode = code;

    // Add React.memo for components
    if (code.includes('export default') && code.includes('function')) {
      optimizedCode = optimizedCode.replace(
        /export default function (\w+)/,
        'export default React.memo(function $1'
      );
    }

    // Add useCallback for functions passed as props
    const functionProps = this.findFunctionProps(code);
    functionProps.forEach(func => {
      optimizedCode = optimizedCode.replace(
        new RegExp(`const ${func} = \\([^)]*\\) =>`, 'g'),
        `const ${func} = useCallback(([^)]*) =>`
      );
    });

    // Add useMemo for expensive calculations
    const expensiveCalculations = this.findExpensiveCalculations(code);
    expensiveCalculations.forEach(calc => {
      optimizedCode = optimizedCode.replace(
        new RegExp(`const \\w+ = ${calc}`, 'g'),
        `const \\w+ = useMemo(() => ${calc}, [])`
      );
    });

    return optimizedCode;
  }

  /**
   * Organize and clean up imports
   */
  organizeImports(code: string): string {
    const lines = code.split('\n');
    const imports: string[] = [];
    const otherLines: string[] = [];
    let inImportBlock = false;

    for (const line of lines) {
      if (line.trim().startsWith('import ')) {
        imports.push(line);
        inImportBlock = true;
      } else if (inImportBlock && line.trim() === '') {
        inImportBlock = false;
        otherLines.push(line);
      } else {
        otherLines.push(line);
      }
    }

    // Sort imports
    const sortedImports = imports.sort((a, b) => {
      const aIsReact = a.includes('react');
      const bIsReact = b.includes('react');
      
      if (aIsReact && !bIsReact) return -1;
      if (!aIsReact && bIsReact) return 1;
      
      return a.localeCompare(b);
    });

    return [...sortedImports, '', ...otherLines].join('\n');
  }

  /**
   * Add error boundaries to components
   */
  addErrorBoundaries(code: string): string {
    if (code.includes('ErrorBoundary')) return code;

    const errorBoundaryComponent = `
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}`;

    return errorBoundaryComponent + '\n\n' + code;
  }

  /**
   * Run the complete refactor process
   */
  refactor(code: string, componentName: string): RefactorResult {
    const changes: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      // Analyze the component
      const analysis = this.analyzeComponent(code);
      suggestions.push(...analysis.suggestions);

      let refactoredCode = code;

      // Apply refactoring options
      if (this.options.extractComponents) {
        const extracted = this.extractComponents(code, componentName);
        if (extracted.length > 0) {
          changes.push(`Extracted ${extracted.length} components`);
          refactoredCode += '\n\n// Extracted Components:\n' + extracted.join('\n\n');
        }
      }

      if (this.options.improveTypes) {
        refactoredCode = this.improveTypes(refactoredCode);
        changes.push('Improved TypeScript types');
      }

      if (this.options.optimizePerformance) {
        refactoredCode = this.optimizePerformance(refactoredCode);
        changes.push('Added performance optimizations');
      }

      if (this.options.organizeImports) {
        refactoredCode = this.organizeImports(refactoredCode);
        changes.push('Organized imports');
      }

      if (this.options.addErrorBoundaries) {
        refactoredCode = this.addErrorBoundaries(refactoredCode);
        changes.push('Added error boundary support');
      }

      return {
        success: true,
        message: 'Refactoring completed successfully',
        changes,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: `Refactoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        changes: [],
        warnings: [error instanceof Error ? error.message : 'Unknown error'],
        suggestions: []
      };
    }
  }

  private findJSXPatterns(code: string): string[] {
    // Simple pattern detection - in a real implementation, this would be more sophisticated
    const patterns: string[] = [];
    const lines = code.split('\n');
    
    for (let i = 0; i < lines.length - 3; i++) {
      if (lines[i].includes('<div') && lines[i + 1].includes('className') && lines[i + 2].includes('>')) {
        patterns.push(lines.slice(i, i + 4).join('\n'));
      }
    }
    
    return patterns;
  }

  private createExtractedComponent(name: string, pattern: string): string {
    return `const ${name}: React.FC = () => {
  return (
    ${pattern}
  );
};`;
  }

  private findFunctionProps(code: string): string[] {
    const functions: string[] = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      const match = line.match(/const (\w+) = \(/);
      if (match) {
        functions.push(match[1]);
      }
    }
    
    return functions;
  }

  private findExpensiveCalculations(code: string): string[] {
    // Simple detection of potentially expensive operations
    const expensive: string[] = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      if (line.includes('.map(') || line.includes('.filter(') || line.includes('.reduce(')) {
        expensive.push(line.trim());
      }
    }
    
    return expensive;
  }
}

/**
 * Utility function to refactor a component file
 */
export function refactorComponent(
  code: string, 
  componentName: string, 
  options?: RefactorOptions
): RefactorResult {
  const refactorTool = new RefactorTool(options);
  return refactorTool.refactor(code, componentName);
}

/**
 * Utility function to analyze component complexity
 */
export function analyzeComponent(code: string): ComponentAnalysis {
  const refactorTool = new RefactorTool();
  return refactorTool.analyzeComponent(code);
}