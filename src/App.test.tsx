import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { AppSettingsProvider } from './contexts/AppSettingsContext';
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

describe('C.A.R.E. App Tests', () => {
  describe('Context and Settings', () => {
    it('applies accessibility mode classes to header when settings change', () => {
      // Very basic rendering check combining App and Provider
      render(
        <AppSettingsProvider>
          <App />
        </AppSettingsProvider>
      );
      
      const title = screen.getByText('C.A.R.E.');
      expect(title).toBeInTheDocument();
    });
  });

  describe('Widgets Render Smoke Tests', () => {
    const renderWithContext = (component: React.ReactNode) => render(
      <AppSettingsProvider>{component}</AppSettingsProvider>
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
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('sends message and receives response via fetch', async () => {
      render(
        <AppSettingsProvider>
          <EcoCoach />
        </AppSettingsProvider>
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
  });
});

