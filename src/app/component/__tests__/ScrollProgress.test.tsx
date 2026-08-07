import { render } from '@testing-library/react';
import ScrollProgress from '../ScrollProgress';

describe('ScrollProgress Component', () => {
  it('renders the progress bar', () => {
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
