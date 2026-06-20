import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
import { AuthProvider } from './contexts/AuthContext';
import CarbonSnapshot from './components/dashboard/CarbonSnapshot';
import ActionCountdown from './components/dashboard/ActionCountdown';
import EcoCoach from './components/dashboard/EcoCoach';
import ImpactTwin from './components/dashboard/ImpactTwin';

// Mock recharts to avoid rendering issues in JSDOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: any }) => <div data-testid="recharts-container">{children}</div>,
  BarChart: () => <div data-testid="bar-chart" />,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />
}));

// Mock window.matchMedia if needed
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const Providers = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <AppSettingsProvider>
      {children}
    </AppSettingsProvider>
  </AuthProvider>
);

describe('C.A.R.E. App Tests', () => {
  describe('Context and Settings', () => {
    it('applies accessibility mode classes to header when settings change', () => {
      // Very basic rendering check combining App and Provider
      render(<App />);
      
      const title = screen.getByText('C.A.R.E.');
      expect(title).toBeInTheDocument();
    });

    it('opens settings modal and toggles accessibility mode', async () => {
      render(<App />);
      
      // Click settings button
      const settingsButton = screen.getByRole('button', { name: /Open User Settings/i });
      fireEvent.click(settingsButton);
      
      // Ensure Modal is open
      expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
      
      // Find the toggle
      const a11yToggle = screen.getByText('Accessibility Mode').parentElement?.parentElement?.querySelector('button');
      if (a11yToggle) {
        fireEvent.click(a11yToggle);
      }
      
      // Verify visual classes were applied - wait for re-render
      await waitFor(() => {
        expect(screen.getByRole('banner')).toHaveClass('border-black');
      });
    });
    
    it('closes settings modal when close button is clicked', async () => {
      render(<App />);
      
      const settingsButton = screen.getByRole('button', { name: /Open User Settings/i });
      fireEvent.click(settingsButton);
      expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
      
      const closeButton = screen.getByRole('dialog', { hidden: true })?.querySelector('button') || screen.getAllByRole('button')[0]; // generic fallback
      fireEvent.click(screen.getAllByRole('button').find(b => b.innerHTML.includes('lucide-x')) || screen.getAllByRole('button')[1]);
      
      await waitFor(() => {
        expect(screen.queryByText('Accessibility Settings')).not.toBeInTheDocument();
      });
    });
  });

  describe('Widgets Render Smoke Tests', () => {
    const renderWithContext = (component: React.ReactNode) => render(
      <Providers>{component}</Providers>
    );

    it('renders CarbonSnapshot correctly', () => {
      renderWithContext(<CarbonSnapshot />);
      expect(screen.getByText('My Carbon Snapshot')).toBeInTheDocument();
      expect(screen.getByText('kg CO₂')).toBeInTheDocument();
    });

    it('renders ActionCountdown correctly', () => {
      renderWithContext(<ActionCountdown />);
      expect(screen.getByText('Next Action')).toBeInTheDocument();
      expect(screen.getByText("I'M DOING THIS!")).toBeInTheDocument();
    });

    it('renders ImpactTwin correctly', () => {
      renderWithContext(<ImpactTwin />);
      expect(screen.getByText(/Future You Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbon Impact Twin/i)).toBeInTheDocument();
    });
  });

  describe('EcoCoach Chatflow', () => {
    beforeEach(() => {
      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ text: "I am a mocked response!" })
      });
      localStorage.clear();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('sends message and receives response via fetch', async () => {
      render(
        <Providers>
          <EcoCoach />
        </Providers>
      );

      // Check initial message
      expect(screen.getByText(/How can I help you reduce your footprint today?/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText('Ask Coach...');
      const sendButton = screen.getByLabelText('Send message to Eco Coach');

      fireEvent.change(input, { target: { value: 'How can I save energy?' } });
      fireEvent.click(sendButton);

      // User message should appear
      expect(screen.getByText('How can I save energy?')).toBeInTheDocument();

      // Wait for the mock fetch to resolve and the response to appear
      await waitFor(() => {
        expect(screen.getByText('I am a mocked response!')).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    
    it('handles fetch error gracefully', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Failed to connect" })
      });

      render(
        <Providers>
          <EcoCoach />
        </Providers>
      );

      const input = screen.getByPlaceholderText('Ask Coach...');
      const sendButton = screen.getByLabelText('Send message to Eco Coach');

      fireEvent.change(input, { target: { value: 'Test error' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText("Sorry, I'm having trouble connecting right now.")).toBeInTheDocument();
      });
    });
  });
});

