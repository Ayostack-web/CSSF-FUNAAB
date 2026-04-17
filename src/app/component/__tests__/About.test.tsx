import { render, screen } from '@testing-library/react';
import About from '../About';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('About Component', () => {
  it('renders the about section with heading', () => {
    render(<About />);
    
    expect(screen.getByText('Our Mission')).toBeInTheDocument();
  });

  it('displays mission statement', () => {
    render(<About />);
    
    const missionText = screen.getByText(
      /We are a passionate community committed to transforming lives/i
    );
    expect(missionText).toBeInTheDocument();
  });

  it('displays values statement', () => {
    render(<About />);
    
    const valuesText = screen.getByText(
      /Guided by our core values of love, compassion, and integrity/i
    );
    expect(valuesText).toBeInTheDocument();
  });

  it('renders learn more button', () => {
    render(<About />);
    
    const learnMoreButton = screen.getByRole('link', { name: /learn more/i });
    expect(learnMoreButton).toBeInTheDocument();
    expect(learnMoreButton).toHaveAttribute('href', '#sermon');
  });

  it('displays mission image', () => {
    render(<About />);
    
    const image = screen.getByAltText('Our Mission');
    expect(image).toBeInTheDocument();
  });

  it('has correct section id for anchor linking', () => {
    const { container } = render(<About />);
    
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'about');
  });
});
