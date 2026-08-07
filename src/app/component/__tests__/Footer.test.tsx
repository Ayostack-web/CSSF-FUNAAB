import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaFacebookF: () => <span>FacebookIcon</span>,
  FaInstagram: () => <span>InstagramIcon</span>,
}));

jest.mock('react-icons/si', () => ({
  SiTiktok: () => <span>TikTokIcon</span>,
}));

jest.mock('react-icons/fa6', () => ({
  FaTelegram: () => <span>TelegramIcon</span>,
}));

describe('Footer Component', () => {
  it('renders footer with heading', () => {
    render(<Footer />);
    
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    render(<Footer />);
    
    const telegramLink = screen.getByRole('link', { name: /telegram/i });
    const facebookLink = screen.getByRole('link', { name: /facebook/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    
    expect(telegramLink).toHaveAttribute('href', 'https://t.me/+vV2dBaEmfBkyZDFk');
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/cssf.unaab');
    expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/cssf_unification_funaab?igsh=YzljYTk1ODg3Zg=='
    );
  });

  it('renders copyright text with current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('displays developer credit', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Developed By/i)).toBeInTheDocument();
    const creditLink = screen.getByRole('link', { name: /ayokunle shittu/i });
    expect(creditLink).toHaveAttribute('href', 'https://ayostack.vercel.app/');
    expect(creditLink).toHaveAttribute('target', '_blank');
  });

  it('social links open in new tab', () => {
    render(<Footer />);
    
    const links = screen.getAllByRole('link');
    const externalLinks = links.filter((link) =>
      link.getAttribute('target') === '_blank'
    );
    
    // Should have at least 3 external links (Telegram, Facebook, Instagram)
    expect(externalLinks.length).toBeGreaterThanOrEqual(3);
  });
});
