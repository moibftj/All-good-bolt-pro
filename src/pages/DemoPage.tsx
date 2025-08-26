import React, { useState } from 'react';
import { RefactorTool } from '../components/refactor/RefactorTool';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Code2, 
  Zap, 
  Type, 
  Package, 
  Shield, 
  TrendingUp,
  Play,
  BookOpen,
  Github
} from 'lucide-react';

export const DemoPage: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string>('basic');

  const examples = {
    basic: {
      name: 'Basic Component',
      description: 'A simple component with state and effects',
      code: `import React from 'react';

function UserCard({ user, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  useEffect(() => {
    setName(user.name);
  }, [user.name]);

  const handleSave = () => {
    onEdit({ ...user, name });
    setIsEditing(false);
  };

  return (
    <div className="user-card">
      {isEditing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
        />
      ) : (
        <h3 onClick={() => setIsEditing(true)}>{user.name}</h3>
      )}
      <p>{user.email}</p>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}`,
      componentName: 'UserCard'
    },
    classComponent: {
      name: 'Class Component',
      description: 'A class component that can be converted to function component',
      code: `import React from 'react';

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    this.fetchTodos();
  }

  async fetchTodos() {
    this.setState({ loading: true });
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      this.setState({ todos, loading: false });
    } catch (error) {
      this.setState({ error: error.message, loading: false });
    }
  }

  addTodo = (text) => {
    this.setState(prevState => ({
      todos: [...prevState.todos, { id: Date.now(), text, completed: false }]
    }));
  };

  toggleTodo = (id) => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  render() {
    const { todos, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div className="todo-list">
        <h2>Todo List</h2>
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => this.toggleTodo(todo.id)}
            />
            <span className={todo.completed ? 'completed' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
        <button onClick={() => this.addTodo('New Todo')}>Add Todo</button>
      </div>
    );
  }
}`,
      componentName: 'TodoList'
    },
    complex: {
      name: 'Complex Component',
      description: 'A complex component with multiple responsibilities',
      code: `import React from 'react';

function Dashboard({ userId, filters, onDataUpdate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchData();
  }, [userId, filters, page, sortBy, sortOrder]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/dashboard/\${userId}?page=\${page}&sortBy=\${sortBy}&sortOrder=\${sortOrder}&filters=\${JSON.stringify(filters)}\`);
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) return;
    
    const updatedData = data.map(item => {
      if (selectedItems.includes(item.id)) {
        switch (action) {
          case 'delete':
            return { ...item, deleted: true };
          case 'archive':
            return { ...item, archived: true };
          case 'markRead':
            return { ...item, read: true };
          default:
            return item;
        }
      }
      return item;
    });
    
    setData(updatedData);
    setSelectedItems([]);
    onDataUpdate(updatedData);
  };

  const renderDataItem = (item) => (
    <div key={item.id} className={\`data-item \${viewMode}\`}>
      <input
        type="checkbox"
        checked={selectedItems.includes(item.id)}
        onChange={() => handleSelect(item.id)}
      />
      <div className="item-content">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
        <div className="item-meta">
          <span>{new Date(item.date).toLocaleDateString()}</span>
          <span className={\`status \${item.status}\`}>{item.status}</span>
        </div>
      </div>
      <div className="item-actions">
        <button onClick={() => onDataUpdate({ ...item, read: true })}>
          Mark Read
        </button>
        <button onClick={() => onDataUpdate({ ...item, archived: true })}>
          Archive
        </button>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">Error loading dashboard: {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="view-controls">
          <button 
            className={\`view-btn \${viewMode === 'grid' ? 'active' : ''}\`}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={\`view-btn \${viewMode === 'list' ? 'active' : ''}\`}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      <div className="dashboard-toolbar">
        <div className="sort-controls">
          <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="status">Status</option>
          </select>
          <button onClick={() => handleSort(sortBy)}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {selectedItems.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedItems.length} items selected</span>
            <button onClick={() => handleBulkAction('markRead')}>Mark Read</button>
            <button onClick={() => handleBulkAction('archive')}>Archive</button>
            <button onClick={() => handleBulkAction('delete')}>Delete</button>
          </div>
        )}
      </div>

      <div className={\`data-container \${viewMode}\`}>
        {data.map(renderDataItem)}
      </div>

      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}`,
      componentName: 'Dashboard'
    }
  };

  const currentExample = examples[activeExample as keyof typeof examples];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Code2 className="inline-block w-10 h-10 mr-3 text-blue-600" />
            React Refactor Tool Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the power of automated React component refactoring with our comprehensive tool. 
            See how it can transform your code for better performance, maintainability, and developer experience.
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="p-6 text-center">
              <Package className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Extraction</h3>
              <p className="text-gray-600 text-sm">Automatically extract reusable components from large, complex components</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6 text-center">
              <Type className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Safety</h3>
              <p className="text-gray-600 text-sm">Improve TypeScript types and add proper event handler typing</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">Optimize renders with React.memo, useCallback, and useMemo</p>
            </div>
          </Card>
          
          <Card>
            <div className="p-6 text-center">
              <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Handling</h3>
              <p className="text-gray-600 text-sm">Add comprehensive error boundaries and loading states</p>
            </div>
          </Card>
        </div>

        {/* Example Selector */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Try Different Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(examples).map(([key, example]) => (
                <button
                  key={key}
                  onClick={() => setActiveExample(key)}
                  className={`p-4 text-left rounded-lg border-2 transition-all ${
                    activeExample === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{example.name}</h3>
                  <p className="text-sm text-gray-600">{example.description}</p>
                  {activeExample === key && (
                    <Badge className="mt-2">Active</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Refactor Tool */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentExample.name}
                </h2>
                <p className="text-gray-600">{currentExample.description}</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
                <Button variant="outline" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  Source
                </Button>
              </div>
            </div>
            
            <RefactorTool 
              initialCode={currentExample.code}
              componentName={currentExample.componentName}
            />
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Refactor Your Components?
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                The React Refactor Tool is designed to help you write better, more maintainable React code. 
                Start with analysis, then apply targeted refactoring to improve performance and code quality.
              </p>
              <div className="flex justify-center space-x-4">
                <Button size="lg">
                  <Play className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};