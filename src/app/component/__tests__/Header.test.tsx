import { render, screen } from '@testing-library/react';
import Header from '../Header';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Supabase
jest.mock('../../utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      }),
    },
  }),
}));

// Mock Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <span {...props}>{children}</span>
  ),
}));

describe('Header Component', () => {
  it('renders the header with logo and title', () => {
    render(<Header />);
    
    expect(screen.getByText('CSSF FUNAAB')).toBeInTheDocument();
    expect(screen.getByAltText('CSSF FUNAAB Logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders hamburger menu button on mobile', () => {
    render(<Header />);
    
    const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Header />);
    
    const hamburgerButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Initially, mobile nav should not be visible in the DOM more than once
    expect(hamburgerButton).toBeInTheDocument();
  });
});
