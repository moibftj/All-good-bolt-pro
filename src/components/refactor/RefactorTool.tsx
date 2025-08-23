import React, { useState, useCallback } from 'react';
import { 
  refactorComponent, 
  analyzeComponent, 
  RefactorOptions, 
  RefactorResult, 
  ComponentAnalysis 
} from '../../utils/refactor';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Code2, 
  Zap, 
  Type, 
  Package, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface RefactorToolProps {
  initialCode?: string;
  componentName?: string;
}

export const RefactorTool: React.FC<RefactorToolProps> = ({ 
  initialCode = '', 
  componentName = 'MyComponent' 
}) => {
  const [code, setCode] = useState(initialCode);
  const [componentNameInput, setComponentNameInput] = useState(componentName);
  const [refactorOptions, setRefactorOptions] = useState<RefactorOptions>({
    extractComponents: true,
    improveTypes: true,
    optimizePerformance: true,
    organizeImports: true,
    addErrorBoundaries: true,
  });
  const [refactorResult, setRefactorResult] = useState<RefactorResult | null>(null);
  const [analysis, setAnalysis] = useState<ComponentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRefactor = useCallback(async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const result = refactorComponent(code, componentNameInput, refactorOptions);
      setRefactorResult(result);
    } catch (error) {
      setRefactorResult({
        success: false,
        message: 'Refactoring failed',
        changes: [],
        warnings: [error instanceof Error ? error.message : 'Unknown error'],
        suggestions: []
      });
    } finally {
      setIsLoading(false);
    }
  }, [code, componentNameInput, refactorOptions]);

  const handleAnalyze = useCallback(() => {
    if (!code.trim()) return;

    try {
      const result = analyzeComponent(code);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  }, [code]);

  const toggleOption = useCallback((option: keyof RefactorOptions) => {
    setRefactorOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  }, []);

  const resetOptions = useCallback(() => {
    setRefactorOptions({
      extractComponents: true,
      improveTypes: true,
      optimizePerformance: true,
      organizeImports: true,
      addErrorBoundaries: true,
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Code2 className="inline-block w-8 h-8 mr-3 text-blue-600" />
          React Refactor Tool
        </h1>
        <p className="text-gray-600 text-lg">
          Analyze and refactor your React components for better code quality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input and Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Component Name Input */}
          <Card>
            <div className="p-4">
              <label htmlFor="component-name" className="block text-sm font-medium text-gray-700 mb-2">
                Component Name
              </label>
              <input
                id="component-name"
                type="text"
                value={componentNameInput}
                onChange={(e) => setComponentNameInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter component name..."
              />
            </div>
          </Card>

          {/* Code Input */}
          <Card>
            <div className="p-4">
              <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-2">
                Component Code
              </label>
              <TextArea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your React component code here..."
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </Card>

          {/* Refactor Options */}
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refactoring Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refactorOptions.extractComponents}
                    onChange={() => toggleOption('extractComponents')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Extract Components</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refactorOptions.improveTypes}
                    onChange={() => toggleOption('improveTypes')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Type className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Improve Types</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refactorOptions.optimizePerformance}
                    onChange={() => toggleOption('optimizePerformance')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Performance Optimization</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refactorOptions.organizeImports}
                    onChange={() => toggleOption('organizeImports')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Organize Imports</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={refactorOptions.addErrorBoundaries}
                    onChange={() => toggleOption('addErrorBoundaries')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Error Boundaries</span>
                </label>
              </div>

              <div className="mt-4 flex space-x-3">
                <Button
                  onClick={resetOptions}
                  variant="outline"
                  size="sm"
                >
                  Reset Options
                </Button>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAnalyze}
              variant="outline"
              disabled={!code.trim()}
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-2" />
              Analyze Component
            </Button>
            <Button
              onClick={handleRefactor}
              disabled={!code.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Refactoring...
                </>
              ) : (
                <>
                  <Code2 className="w-4 h-4 mr-2" />
                  Refactor Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Component Analysis */}
          {analysis && (
            <Card>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Component Analysis</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Complexity:</span>
                    <Badge variant={analysis.complexity > 5 ? 'destructive' : 'default'}>
                      {analysis.complexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Props Count:</span>
                    <Badge variant={analysis.propsCount > 5 ? 'destructive' : 'default'}>
                      {analysis.propsCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Has State:</span>
                    <Badge variant={analysis.hasState ? 'default' : 'secondary'}>
                      {analysis.hasState ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Has Effects:</span>
                    <Badge variant={analysis.hasEffects ? 'default' : 'secondary'}>
                      {analysis.hasEffects ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Custom Hooks:</span>
                    <Badge variant={analysis.hasCustomHooks ? 'default' : 'secondary'}>
                      {analysis.hasCustomHooks ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>

                {analysis.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <Info className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Refactor Results */}
          {refactorResult && (
            <Card>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  {refactorResult.success ? (
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {refactorResult.success ? 'Refactoring Successful' : 'Refactoring Failed'}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">{refactorResult.message}</p>

                {refactorResult.changes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Changes Made:</h4>
                    <ul className="space-y-1">
                      {refactorResult.changes.map((change, index) => (
                        <li key={index} className="text-sm text-green-600 flex items-start">
                          <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {refactorResult.warnings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Warnings:</h4>
                    <ul className="space-y-1">
                      {refactorResult.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-red-600 flex items-start">
                          <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {refactorResult.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Suggestions:</h4>
                    <ul className="space-y-1">
                      {refactorResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-600 flex items-start">
                          <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};