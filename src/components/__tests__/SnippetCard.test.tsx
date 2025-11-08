import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SnippetCard from '../SnippetCard';

describe('SnippetCard', () => {
  const mockProps = {
    id: '1',
    title: 'Test Snippet',
    description: 'This is a test snippet',
    language: 'javascript',
    tags: ['test', 'example'],
    createdAt: '2024-01-01T00:00:00Z',
    username: 'testuser',
  };

  it('renders snippet title', () => {
    const { getByText } = render(
      <BrowserRouter>
        <SnippetCard {...mockProps} />
      </BrowserRouter>
    );
    
    expect(getByText('Test Snippet')).toBeDefined();
  });

  it('renders snippet description', () => {
    const { getByText } = render(
      <BrowserRouter>
        <SnippetCard {...mockProps} />
      </BrowserRouter>
    );
    
    expect(getByText('This is a test snippet')).toBeDefined();
  });

  it('renders language badge', () => {
    const { getByText } = render(
      <BrowserRouter>
        <SnippetCard {...mockProps} />
      </BrowserRouter>
    );
    
    expect(getByText('javascript')).toBeDefined();
  });

  it('renders all tags', () => {
    const { getByText } = render(
      <BrowserRouter>
        <SnippetCard {...mockProps} />
      </BrowserRouter>
    );
    
    expect(getByText('test')).toBeDefined();
    expect(getByText('example')).toBeDefined();
  });

  it('renders username', () => {
    const { getByText } = render(
      <BrowserRouter>
        <SnippetCard {...mockProps} />
      </BrowserRouter>
    );
    
    expect(getByText('testuser')).toBeDefined();
  });
});
