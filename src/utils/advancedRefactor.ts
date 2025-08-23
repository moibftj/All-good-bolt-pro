import { ComponentType, ReactNode } from 'react';

export interface AdvancedRefactorOptions {
  convertToFunctionComponent?: boolean;
  extractCustomHooks?: boolean;
  addPropTypes?: boolean;
  improveAccessibility?: boolean;
  addErrorHandling?: boolean;
  optimizeRenders?: boolean;
  addLoadingStates?: boolean;
}

export interface CodePattern {
  type: 'class-component' | 'function-component' | 'custom-hook' | 'jsx-pattern' | 'state-pattern';
  startLine: number;
  endLine: number;
  code: string;
  suggestion: string;
}

export interface AdvancedRefactorResult {
  success: boolean;
  message: string;
  refactoredCode: string;
  patterns: CodePattern[];
  improvements: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Advanced refactoring utility for React components
 */
export class AdvancedRefactorTool {
  private options: AdvancedRefactorOptions;

  constructor(options: AdvancedRefactorOptions = {}) {
    this.options = {
      convertToFunctionComponent: true,
      extractCustomHooks: true,
      addPropTypes: true,
      improveAccessibility: true,
      addErrorHandling: true,
      optimizeRenders: true,
      addLoadingStates: true,
      ...options
    };
  }

  /**
   * Convert class component to function component
   */
  convertClassToFunction(code: string): string {
    if (!code.includes('class') || !code.includes('extends React.Component')) {
      return code;
    }

    let convertedCode = code;

    // Extract class name
    const classNameMatch = code.match(/class (\w+) extends/);
    if (!classNameMatch) return code;
    
    const className = classNameMatch[1];

    // Convert constructor to useState
    const constructorMatch = code.match(/constructor\([^)]*\)\s*\{([^}]*)\}/s);
    if (constructorMatch) {
      const constructorBody = constructorMatch[1];
      const stateMatch = constructorBody.match(/this\.state\s*=\s*(\{[^}]*\})/);
      if (stateMatch) {
        const stateObject = stateMatch[1];
        const stateEntries = this.parseStateObject(stateObject);
        const useStateHooks = stateEntries.map(([key, value]) => 
          `const [${key}, set${key.charAt(0).toUpperCase() + key.slice(1)}] = useState(${value});`
        ).join('\n  ');
        
        convertedCode = convertedCode.replace(
          /constructor\([^)]*\)\s*\{[^}]*\}/s,
          useStateHooks
        );
      }
    }

    // Convert class method to function
    convertedCode = convertedCode.replace(
      /class \w+ extends React\.Component[^}]*\{/s,
      `function ${className}({ ${this.extractProps(code).join(', ')} }) {`
    );

    // Convert this.state to state variables
    convertedCode = convertedCode.replace(/this\.state\.(\w+)/g, '$1');

    // Convert this.setState to setState functions
    convertedCode = convertedCode.replace(
      /this\.setState\((\{[^}]*\})\)/g,
      (match, stateUpdate) => {
        const updates = this.parseStateObject(stateUpdate);
        return updates.map(([key, value]) => 
          `set${key.charAt(0).toUpperCase() + key.slice(1)}(${value});`
        ).join('\n    ');
      }
    );

    // Remove render method wrapper
    convertedCode = convertedCode.replace(/render\(\)\s*\{/g, '');
    convertedCode = convertedCode.replace(/\s*return\s*\(/g, '  return (');
    convertedCode = convertedCode.replace(/^\s*\}\s*$/gm, '');

    // Add React import if not present
    if (!convertedCode.includes('import React')) {
      convertedCode = 'import React, { useState } from \'react\';\n\n' + convertedCode;
    }

    return convertedCode;
  }

  /**
   * Extract custom hooks from component logic
   */
  extractCustomHooks(code: string): string[] {
    const hooks: string[] = [];
    const lines = code.split('\n');
    
    // Look for state and effect patterns that could be extracted
    let currentHook = '';
    let inHook = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes('useState') || line.includes('useEffect')) {
        if (!inHook) {
          inHook = true;
          currentHook = `// Custom hook extracted from ${i + 1} line\n`;
          currentHook += `export const use${this.generateHookName(lines, i)} = () => {\n`;
        }
        currentHook += `  ${line}\n`;
      } else if (inHook && (line.includes('const') || line.includes('function'))) {
        // End of hook logic
        currentHook += '};\n\n';
        hooks.push(currentHook);
        inHook = false;
        currentHook = '';
      } else if (inHook) {
        currentHook += `  ${line}\n`;
      }
    }
    
    if (inHook && currentHook) {
      currentHook += '};\n\n';
      hooks.push(currentHook);
    }
    
    return hooks;
  }

  /**
   * Add PropTypes for better type checking
   */
  addPropTypes(code: string): string {
    if (code.includes('PropTypes') || code.includes('interface') || code.includes('type')) {
      return code;
    }

    const props = this.extractProps(code);
    if (props.length === 0) return code;

    const propTypes = props.map(prop => {
      const propName = prop.replace(/[^a-zA-Z0-9]/g, '');
      return `  ${propName}: PropTypes.any.isRequired,`;
    }).join('\n');

    const propTypesBlock = `
${code}

${this.extractComponentName(code)}.propTypes = {
${propTypes}
};`;

    // Add PropTypes import
    if (!code.includes('import PropTypes')) {
      return `import PropTypes from 'prop-types';\n${propTypesBlock}`;
    }

    return propTypesBlock;
  }

  /**
   * Improve accessibility of the component
   */
  improveAccessibility(code: string): string {
    let improvedCode = code;

    // Add aria-labels to buttons without text
    improvedCode = improvedCode.replace(
      /<button([^>]*)>([^<]*)<\/button>/g,
      (match, attrs, content) => {
        if (!content.trim() && !attrs.includes('aria-label')) {
          return `<button${attrs} aria-label="Button">${content}</button>`;
        }
        return match;
      }
    );

    // Add role attributes to interactive elements
    improvedCode = improvedCode.replace(
      /<div([^>]*onClick[^>]*)>/g,
      '<div$1 role="button" tabIndex={0}>'
    );

    // Add alt text to images
    improvedCode = improvedCode.replace(
      /<img([^>]*)\/>/g,
      (match, attrs) => {
        if (!attrs.includes('alt=')) {
          return `<img${attrs} alt="Image" />`;
        }
        return match;
      }
    );

    return improvedCode;
  }

  /**
   * Add error handling and loading states
   */
  addErrorHandling(code: string): string {
    if (code.includes('try {') || code.includes('catch')) {
      return code;
    }

    let improvedCode = code;

    // Add error boundary wrapper
    if (code.includes('return (') && !code.includes('ErrorBoundary')) {
      improvedCode = improvedCode.replace(
        /return \(/g,
        `  if (error) {
    return (
      <div className="error-state" role="alert">
        <p>Something went wrong: {error}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return (`
      );
    }

    return improvedCode;
  }

  /**
   * Optimize renders with React.memo and useCallback
   */
  optimizeRenders(code: string): string {
    let optimizedCode = code;

    // Wrap function components with React.memo
    if (code.includes('export default function') && !code.includes('React.memo')) {
      optimizedCode = optimizedCode.replace(
        /export default function (\w+)/,
        'export default React.memo(function $1'
      );
    }

    // Add useCallback for event handlers
    const eventHandlers = this.findEventHandlers(code);
    eventHandlers.forEach(handler => {
      if (!code.includes('useCallback')) {
        optimizedCode = optimizedCode.replace(
          new RegExp(`const ${handler} = \\([^)]*\\) =>`, 'g'),
          `const ${handler} = useCallback(([^)]*) =>`
        );
      }
    });

    // Add useMemo for expensive calculations
    const expensiveOps = this.findExpensiveOperations(code);
    expensiveOps.forEach(op => {
      optimizedCode = optimizedCode.replace(
        new RegExp(`const \\w+ = ${op}`, 'g'),
        `const \\w+ = useMemo(() => ${op}, [])`
      );
    });

    return optimizedCode;
  }

  /**
   * Run the complete advanced refactor process
   */
  refactor(code: string, componentName: string): AdvancedRefactorResult {
    const patterns: CodePattern[] = [];
    const improvements: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    try {
      let refactoredCode = code;

      // Analyze code patterns
      patterns.push(...this.analyzeCodePatterns(code));

      // Apply refactoring options
      if (this.options.convertToFunctionComponent && code.includes('class')) {
        refactoredCode = this.convertClassToFunction(refactoredCode);
        improvements.push('Converted class component to function component');
      }

      if (this.options.extractCustomHooks) {
        const hooks = this.extractCustomHooks(refactoredCode);
        if (hooks.length > 0) {
          refactoredCode += '\n\n// Extracted Custom Hooks:\n' + hooks.join('\n');
          improvements.push(`Extracted ${hooks.length} custom hooks`);
        }
      }

      if (this.options.addPropTypes) {
        refactoredCode = this.addPropTypes(refactoredCode);
        improvements.push('Added PropTypes for better type checking');
      }

      if (this.options.improveAccessibility) {
        refactoredCode = this.improveAccessibility(refactoredCode);
        improvements.push('Improved accessibility with ARIA attributes');
      }

      if (this.options.addErrorHandling) {
        refactoredCode = this.addErrorHandling(refactoredCode);
        improvements.push('Added error handling and loading states');
      }

      if (this.options.optimizeRenders) {
        refactoredCode = this.optimizeRenders(refactoredCode);
        improvements.push('Optimized renders with React.memo and useCallback');
      }

      // Generate suggestions based on patterns
      suggestions.push(...this.generateSuggestions(patterns));

      return {
        success: true,
        message: 'Advanced refactoring completed successfully',
        refactoredCode,
        patterns,
        improvements,
        warnings,
        suggestions
      };

    } catch (error) {
      return {
        success: false,
        message: `Advanced refactoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        refactoredCode: code,
        patterns: [],
        improvements: [],
        warnings: [error instanceof Error ? error.message : 'Unknown error'],
        suggestions: []
      };
    }
  }

  private parseStateObject(stateString: string): [string, string][] {
    try {
      // Simple parsing of state object
      const matches = stateString.match(/(\w+):\s*([^,}]+)/g);
      if (!matches) return [];
      
      return matches.map(match => {
        const [key, value] = match.split(':').map(s => s.trim());
        return [key, value];
      });
    } catch {
      return [];
    }
  }

  private extractProps(code: string): string[] {
    const props: string[] = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      const match = line.match(/this\.props\.(\w+)/);
      if (match) {
        props.push(match[1]);
      }
    }
    
    return [...new Set(props)];
  }

  private extractComponentName(code: string): string {
    const match = code.match(/function (\w+)/) || code.match(/class (\w+)/);
    return match ? match[1] : 'Component';
  }

  private generateHookName(lines: string[], startLine: number): string {
    // Generate a meaningful hook name based on context
    const context = lines.slice(Math.max(0, startLine - 2), startLine + 3).join(' ');
    if (context.includes('user')) return 'User';
    if (context.includes('data')) return 'Data';
    if (context.includes('form')) return 'Form';
    return 'Custom';
  }

  private findEventHandlers(code: string): string[] {
    const handlers: string[] = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      const match = line.match(/const (\w+) = \(/);
      if (match && (line.includes('onClick') || line.includes('onSubmit') || line.includes('onChange'))) {
        handlers.push(match[1]);
      }
    }
    
    return handlers;
  }

  private findExpensiveOperations(code: string): string[] {
    const expensive: string[] = [];
    const lines = code.split('\n');
    
    for (const line of lines) {
      if (line.includes('.map(') || line.includes('.filter(') || line.includes('.reduce(')) {
        expensive.push(line.trim());
      }
    }
    
    return expensive;
  }

  private analyzeCodePatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    const lines = code.split('\n');
    
    // Look for class components
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('class') && lines[i].includes('extends React.Component')) {
        patterns.push({
          type: 'class-component',
          startLine: i + 1,
          endLine: i + 1,
          code: lines[i],
          suggestion: 'Consider converting to function component for better performance and hooks support'
        });
      }
    }
    
    // Look for state patterns
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('useState')) {
        patterns.push({
          type: 'state-pattern',
          startLine: i + 1,
          endLine: i + 1,
          code: lines[i],
          suggestion: 'Consider grouping related state into a single object or custom hook'
        });
      }
    }
    
    return patterns;
  }

  private generateSuggestions(patterns: CodePattern[]): string[] {
    const suggestions: string[] = [];
    
    patterns.forEach(pattern => {
      suggestions.push(pattern.suggestion);
    });
    
    return suggestions;
  }
}

/**
 * Utility function to run advanced refactoring
 */
export function advancedRefactor(
  code: string,
  componentName: string,
  options?: AdvancedRefactorOptions
): AdvancedRefactorResult {
  const refactorTool = new AdvancedRefactorTool(options);
  return refactorTool.refactor(code, componentName);
}