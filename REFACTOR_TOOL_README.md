# React Refactor Tool

A comprehensive refactoring utility for React TypeScript applications that helps improve code quality, performance, and maintainability.

## Features

### 🔍 **Code Analysis**
- **Complexity Analysis**: Measures component complexity based on control flow statements
- **Props Count**: Tracks the number of props used in components
- **State Management**: Identifies state usage patterns
- **Custom Hooks**: Detects custom hook implementations
- **Performance Indicators**: Flags potential performance issues

### 🛠️ **Refactoring Capabilities**
- **Component Extraction**: Automatically extracts reusable components from large components
- **TypeScript Improvements**: Adds proper typing for event handlers and form events
- **Performance Optimization**: Implements React.memo, useCallback, and useMemo
- **Import Organization**: Sorts and organizes import statements
- **Error Boundaries**: Adds error boundary support for better error handling

### 🚀 **Advanced Refactoring**
- **Class to Function Conversion**: Converts class components to function components
- **Custom Hook Extraction**: Extracts stateful logic into reusable custom hooks
- **PropTypes Addition**: Adds PropTypes for better runtime type checking
- **Accessibility Improvements**: Enhances ARIA attributes and semantic markup
- **Error Handling**: Adds comprehensive error handling and loading states

## Installation

The refactor tool is already included in your project. Make sure you have the required dependencies:

```bash
npm install clsx lucide-react
```

## Usage

### Basic Refactoring

```typescript
import { refactorComponent, analyzeComponent } from './src/utils/refactor';

// Analyze a component
const analysis = analyzeComponent(componentCode);
console.log('Component complexity:', analysis.complexity);

// Refactor a component
const result = refactorComponent(componentCode, 'MyComponent', {
  extractComponents: true,
  improveTypes: true,
  optimizePerformance: true,
  organizeImports: true,
  addErrorBoundaries: true
});

if (result.success) {
  console.log('Refactoring successful!');
  console.log('Changes made:', result.changes);
}
```

### Advanced Refactoring

```typescript
import { advancedRefactor } from './src/utils/advancedRefactor';

const result = advancedRefactor(componentCode, 'MyComponent', {
  convertToFunctionComponent: true,
  extractCustomHooks: true,
  addPropTypes: true,
  improveAccessibility: true,
  addErrorHandling: true,
  optimizeRenders: true,
  addLoadingStates: true
});

console.log('Refactored code:', result.refactoredCode);
console.log('Patterns found:', result.patterns);
```

### Using the UI Component

```typescript
import { RefactorTool } from './src/components/refactor/RefactorTool';

// In your component
<RefactorTool 
  initialCode={yourComponentCode}
  componentName="YourComponent"
/>
```

## Configuration Options

### Basic Refactor Options

| Option | Description | Default |
|--------|-------------|---------|
| `extractComponents` | Extract reusable components from large components | `true` |
| `improveTypes` | Add proper TypeScript typing | `true` |
| `optimizePerformance` | Add performance optimizations | `true` |
| `organizeImports` | Sort and organize import statements | `true` |
| `addErrorBoundaries` | Add error boundary support | `true` |

### Advanced Refactor Options

| Option | Description | Default |
|--------|-------------|---------|
| `convertToFunctionComponent` | Convert class components to function components | `true` |
| `extractCustomHooks` | Extract custom hooks from component logic | `true` |
| `addPropTypes` | Add PropTypes for runtime type checking | `true` |
| `improveAccessibility` | Enhance accessibility with ARIA attributes | `true` |
| `addErrorHandling` | Add comprehensive error handling | `true` |
| `optimizeRenders` | Optimize renders with React.memo and useCallback | `true` |
| `addLoadingStates` | Add loading state management | `true` |

## Examples

### Before Refactoring

```typescript
import React from 'react';

function UserProfile({ userId, onUpdate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedData) => {
    onUpdate(updatedData);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => handleUpdate(user)}>Update Profile</button>
    </div>
  );
}

export default UserProfile;
```

### After Refactoring

```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

const UserProfile: React.FC<{ userId: string; onUpdate: (data: any) => void }> = React.memo(({ userId, onUpdate }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  const handleUpdate = useCallback((updatedData: any) => {
    onUpdate(updatedData);
  }, [onUpdate]);

  const userDisplay = useMemo(() => {
    if (!user) return null;
    return (
      <div className="user-profile">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <button 
          onClick={() => handleUpdate(user)}
          aria-label="Update user profile"
        >
          Update Profile
        </button>
      </div>
    );
  }, [user, handleUpdate]);

  if (loading) return <div role="status" aria-live="polite">Loading...</div>;
  if (error) return (
    <div className="error-state" role="alert">
      <p>Error: {error}</p>
      <button onClick={() => setError(null)}>Try Again</button>
    </div>
  );
  if (!user) return <div>No user found</div>;

  return userDisplay;
});

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UserProfile;

// Extracted Custom Hooks:
export const useUserData = (userId: string) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser(userId);
  }, [userId, fetchUser]);

  return { user, loading, error, refetch: () => fetchUser(userId) };
};
```

## Best Practices

### 1. **Start with Analysis**
Always analyze your component first to understand its current state and identify improvement opportunities.

### 2. **Incremental Refactoring**
Apply refactoring options one at a time to ensure each change improves the code without introducing bugs.

### 3. **Test After Refactoring**
Run your tests after each refactoring step to ensure functionality is preserved.

### 4. **Review Generated Code**
The tool generates suggestions, but always review the output to ensure it meets your coding standards.

### 5. **Customize Options**
Adjust refactoring options based on your project's specific needs and constraints.

## Integration

### Adding to Your App

```typescript
// In your main App.tsx or routing configuration
import { RefactorPage } from './pages/RefactorPage';

// Add to your routes
<Route path="/refactor" element={<RefactorPage />} />
```

### Using in Development

```typescript
// Add a development-only route
{process.env.NODE_ENV === 'development' && (
  <Route path="/dev/refactor" element={<RefactorPage />} />
)}
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure all required types are properly imported
2. **Performance Issues**: The tool analyzes code patterns but may not catch all edge cases
3. **Large Components**: Very large components may take longer to process

### Getting Help

- Check the console for detailed error messages
- Review the generated suggestions and warnings
- Test the refactored code thoroughly before committing

## Contributing

The refactor tool is designed to be extensible. You can:

- Add new refactoring patterns
- Improve the analysis algorithms
- Add support for additional React patterns
- Enhance the UI components

## License

This tool is part of your React TypeScript project and follows the same license terms.