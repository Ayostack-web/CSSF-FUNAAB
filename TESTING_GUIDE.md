# Testing Guide for CSSF FUNAAB

## Quick Start

### 1. Install Dependencies
The test dependencies are already added to `package.json`:
- Jest
- React Testing Library
- @testing-library/jest-dom

Run: `npm install`

### 2. Run Tests
```bash
# Watch mode (recommended for development)
npm test

# Run once (recommended for CI)
npm run test:ci

# Run specific test file
npm test -- Header.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders"

# Verbose output
npm test -- --verbose
```

## Project Structure

```
src/
├── lib/
│   ├── validation.ts (logic to test)
│   └── __tests__/
│       └── validation.test.ts (tests)
├── app/
│   ├── component/
│   │   ├── Header.tsx (component to test)
│   │   └── __tests__/
│   │       └── Header.test.tsx (component tests)
│   └── api/
│       └── route.ts (API to test)
```

## Writing Tests

### Test File Naming
- Place tests in `__tests__` folder next to source code
- Name: `ComponentName.test.tsx` or `functionName.test.ts`

### Basic Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Common Testing Patterns

### 1. Testing Components
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('handles menu toggle on mobile', async () => {
    render(<Header />);
    const button = screen.getByRole('button', { name: /toggle menu/i });
    
    await userEvent.click(button);
    expect(button).toHaveClass('rotate-180');
  });
});
```

### 2. Testing Functions
```typescript
import { validateEmail } from '../validation';

describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### 3. Mocking Dependencies
```typescript
// Mock external module
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock function
const mockFetch = jest.fn();
global.fetch = mockFetch;
```

### 4. Testing Async Operations
```typescript
it('fetches data', async () => {
  const mockData = { name: 'Test' };
  global.fetch = jest.fn(() =>
    Promise.resolve(new Response(JSON.stringify(mockData)))
  );

  render(<MyComponent />);
  
  await screen.findByText('Test');
  expect(global.fetch).toHaveBeenCalledWith('/api/data');
});
```

## Debugging Tests

### 1. View Rendered HTML
```typescript
it('renders correctly', () => {
  const { container } = render(<MyComponent />);
  console.log(container.innerHTML); // Print HTML
});
```

### 2. Screen Queries Documentation
```typescript
// Best practices (in order of preference)
screen.getByRole('button', { name: /submit/i })        // Accessibility
screen.getByLabelText(/email/i)                        // Forms
screen.getByPlaceholderText(/email/i)                  // Forms
screen.getByText(/submit/i)                            // Last resort
screen.getByTestId('custom-id')                        // Fallback

// Query options
screen.queryBy... // Returns null if not found (for non-existence tests)
screen.findBy... // Async, waits for element (for async operations)
```

### 3. Debug Mode
```typescript
import { render, screen } from '@testing-library/react';

it('debug test', () => {
  const { debug } = render(<MyComponent />);
  debug(); // Prints rendered HTML
});
```

## Coverage

### Generate Coverage Report
```bash
npm run test:ci # Already includes coverage
```

### View Coverage Results
Open `coverage/lcov-report/index.html` in browser

### Coverage Goals
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

## Tips & Tricks

### Mock Next.js Components
```typescript
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));
```

### Test Async State Updates
```typescript
import { waitFor } from '@testing-library/react';

it('updates state', async () => {
  render(<MyComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Test Forms
```typescript
import userEvent from '@testing-library/user-event';

it('submits form', async () => {
  render(<LoginForm />);
  
  await userEvent.type(
    screen.getByPlaceholderText(/email/i),
    'test@example.com'
  );
  
  await userEvent.type(
    screen.getByPlaceholderText(/password/i),
    'password123'
  );
  
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  
  expect(screen.getByText(/logged in/i)).toBeInTheDocument();
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Common Issues

### Issue: "Cannot find module" in tests
**Solution:** Check jest.config.js moduleNameMapper configuration

### Issue: Tests timeout
**Solution:** Increase timeout with `jest.setTimeout(10000);`

### Issue: Mock not applied
**Solution:** Ensure jest.mock() is called before import

### Issue: Component not rendering
**Solution:** Check if all required props are provided

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
```

---

Last Updated: April 17, 2026
