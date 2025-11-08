# CI/CD Pipeline Documentation

## Overview

This project includes a complete CI/CD pipeline using GitHub Actions. The pipeline automates testing, linting, building, and deployment processes.

## Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to main/master branches.

**Jobs:**
- **Lint & Type Check**: Runs ESLint and TypeScript type checking
- **Test**: Executes unit tests and generates coverage reports
- **Build**: Builds the application and uploads artifacts

**Triggers:**
- Pull requests to main/master
- Pushes to main/master

### 2. CD Pipeline (`.github/workflows/cd.yml`)

Handles deployment to production.

**Jobs:**
- **Deploy**: Builds and prepares the application for deployment

**Note**: Lovable automatically handles deployment:
- **Frontend changes**: Click "Update" in the Lovable publish dialog
- **Backend changes**: Edge functions and migrations deploy automatically

**Triggers:**
- Pushes to main/master
- Manual trigger via workflow_dispatch

### 3. Supabase Functions (`.github/workflows/supabase-functions.yml`)

Monitors edge function changes.

**Jobs:**
- **Deploy Edge Functions**: Detects changes and confirms auto-deployment

**Triggers:**
- Changes to `supabase/functions/**`
- Manual trigger via workflow_dispatch

### 4. Code Quality (`.github/workflows/code-quality.yml`)

Performs security audits and code analysis.

**Jobs:**
- **Security Audit**: Runs npm audit for vulnerabilities
- **Dependency Review**: Reviews dependency changes in PRs
- **Code Analysis**: Checks for unused dependencies and analyzes bundle size

### 5. PR Validation (`.github/workflows/pr-validation.yml`)

Validates pull requests.

**Jobs:**
- **Validate PR**: Checks PR title format, merge conflicts, and file changes
- Posts statistics comment on PRs

**PR Title Format:**
Use conventional commit types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions or updates
- `build:` - Build system changes
- `ci:` - CI/CD changes
- `chore:` - Maintenance tasks

### 6. Performance Monitoring (`.github/workflows/performance.yml`)

Monitors application performance.

**Jobs:**
- **Lighthouse CI**: Runs Lighthouse audits
- **Bundle Analysis**: Analyzes bundle size and outputs statistics

## Setup Instructions

### 1. GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets → Actions):

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase anon/public key

### 2. Running Tests Locally

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### 3. Required Scripts in package.json

The following scripts need to be added to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

**Note**: Do not edit package.json directly. Ask the AI to add these scripts using the proper tools.

## Pull Request Process

1. Create a new branch from main/master
2. Make your changes
3. Ensure all tests pass locally
4. Create a pull request using the PR template
5. Wait for CI checks to complete
6. Address any issues found by automated checks
7. Request review from team members
8. Merge after approval and passing checks

## Test Structure

Tests are located in `src/components/__tests__/` and follow these conventions:

- **File naming**: `ComponentName.test.tsx`
- **Test framework**: Vitest
- **Testing library**: @testing-library/react
- **Assertions**: @testing-library/jest-dom

### Writing Tests

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<YourComponent />);
    expect(getByText('Expected Text')).toBeDefined();
  });
});
```

## Coverage Reports

Coverage reports are generated in the `coverage/` directory after running `npm run test:coverage`.

**Coverage thresholds** (recommended):
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## Deployment

### Frontend Deployment

Frontend changes require manual deployment via Lovable:
1. Make your changes
2. Push to GitHub
3. Open your Lovable project
4. Click the Publish button
5. Click "Update" to deploy changes

### Backend Deployment

Backend changes deploy automatically:
- **Edge functions**: Deploy immediately when pushed to GitHub
- **Database migrations**: Apply automatically through Lovable Cloud
- **No manual action required**

## Troubleshooting

### Failed CI Checks

1. **Type errors**: Run `npm run build` locally to catch TypeScript errors
2. **Test failures**: Run `npm test` locally to debug
3. **Lint errors**: Run `npm run lint` and fix issues

### Slow CI Runs

- Check if dependencies need to be cached
- Review test execution time
- Consider splitting large test suites

### Build Failures

- Ensure environment variables are set in GitHub secrets
- Check for missing dependencies
- Verify Node.js version compatibility

## Best Practices

1. **Write tests for new features**
2. **Keep PRs small and focused**
3. **Use meaningful commit messages**
4. **Update documentation when needed**
5. **Run tests locally before pushing**
6. **Review CI output for warnings**
7. **Keep dependencies up to date**

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Lovable Documentation](https://docs.lovable.dev/)

## Support

For issues with:
- **CI/CD pipelines**: Check GitHub Actions logs
- **Testing**: Review Vitest documentation
- **Deployment**: Consult Lovable documentation
- **Lovable Cloud**: Use the Cloud interface in your project
