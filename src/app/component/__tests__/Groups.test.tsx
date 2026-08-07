import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import Groups from '../Groups';

type MockImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
};

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: MockImageProps) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt} src={props.src} className={props.className} />
  ),
}));

// Mock Badge component
jest.mock('@/components/ui/badge', () => ({
  Badge: (props: {
    children?: ReactNode;
    className?: string;
    variant?: string;
  }) => <span className={props.className}>{props.children}</span>,
}));

describe('Groups Component', () => {
  it('renders the section title', () => {
    render(<Groups />);
    expect(screen.getByText('KINGDOM BUILDERS')).toBeInTheDocument();
  });

  it('renders all six ministry units', () => {
    render(<Groups />);
    const units = [
      'Prayer Unit',
      'Choir',
      'Drama unit',
      'Evangelical Unit',
      'Media Unit',
      'Levite Unit',
    ];
    units.forEach((unit) => {
      expect(screen.getByText(unit)).toBeInTheDocument();
    });
  });
});
