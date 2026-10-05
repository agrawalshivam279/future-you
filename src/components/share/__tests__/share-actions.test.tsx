import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareActions } from '../share-actions';
import { ToastProvider } from '@/components/ui/toast';
import { DEFAULT_SHARE_CONFIG, ShareCardData } from '@/types/share.types';
import * as exportActions from '@/lib/export/card-export-actions';

jest.mock('@/lib/export/card-export-actions', () => ({
  downloadCard: jest.fn(),
  copyCardToClipboard: jest.fn(),
}));

const mockData: ShareCardData = {
  primaryGoal: 'Lead AI systems architecture',
  improvedHeadline: 'Principal Architect with balanced habits',
  improvedQuote: 'The small daily boundaries created freedom.',
  currentHeadline: 'Senior Developer firefighting bugs',
  alignmentScore: 90,
  habits: [{ label: 'Deep Work', baseline: 10, target: 25 }],
  generatedAt: '2026-10-06T00:00:00.000Z',
};

function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('ShareActions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three export actions with accessible labels', () => {
    renderWithToast(<ShareActions data={mockData} config={DEFAULT_SHARE_CONFIG} />);

    expect(
      screen.getByRole('button', { name: /download png card image/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download vector svg card/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /copy card image to clipboard/i })
    ).toBeInTheDocument();
  });

  it('triggers downloadCard with png format when PNG button is clicked', async () => {
    (exportActions.downloadCard as jest.Mock).mockResolvedValueOnce(
      'future-you-simulation-2026-10-06.png'
    );
    const handleSuccess = jest.fn();

    renderWithToast(
      <ShareActions
        data={mockData}
        config={DEFAULT_SHARE_CONFIG}
        onExportSuccess={handleSuccess}
      />
    );

    const pngBtn = screen.getByRole('button', { name: /download png card image/i });
    fireEvent.click(pngBtn);

    await waitFor(() => {
      expect(exportActions.downloadCard).toHaveBeenCalledWith(
        mockData,
        expect.objectContaining({ format: 'png' })
      );
      expect(handleSuccess).toHaveBeenCalledWith('png');
    });
  });

  it('triggers downloadCard with svg format when SVG button is clicked', async () => {
    (exportActions.downloadCard as jest.Mock).mockResolvedValueOnce(
      'future-you-simulation-2026-10-06.svg'
    );
    const handleSuccess = jest.fn();

    renderWithToast(
      <ShareActions
        data={mockData}
        config={DEFAULT_SHARE_CONFIG}
        onExportSuccess={handleSuccess}
      />
    );

    const svgBtn = screen.getByRole('button', { name: /download vector svg card/i });
    fireEvent.click(svgBtn);

    await waitFor(() => {
      expect(exportActions.downloadCard).toHaveBeenCalledWith(
        mockData,
        expect.objectContaining({ format: 'svg' })
      );
      expect(handleSuccess).toHaveBeenCalledWith('svg');
    });
  });

  it('triggers copyCardToClipboard when Copy button is clicked and shows Copied state', async () => {
    (exportActions.copyCardToClipboard as jest.Mock).mockResolvedValueOnce(true);
    const handleSuccess = jest.fn();

    renderWithToast(
      <ShareActions
        data={mockData}
        config={DEFAULT_SHARE_CONFIG}
        onExportSuccess={handleSuccess}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copy card image to clipboard/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(exportActions.copyCardToClipboard).toHaveBeenCalledWith(
        mockData,
        DEFAULT_SHARE_CONFIG
      );
      expect(screen.getByText('Copied!')).toBeInTheDocument();
      expect(handleSuccess).toHaveBeenCalledWith('clipboard');
    });
  });

  it('handles export errors gracefully', async () => {
    (exportActions.downloadCard as jest.Mock).mockRejectedValueOnce(
      new Error('Canvas export blocked')
    );

    renderWithToast(<ShareActions data={mockData} config={DEFAULT_SHARE_CONFIG} />);

    const pngBtn = screen.getByRole('button', { name: /download png card image/i });
    fireEvent.click(pngBtn);

    await waitFor(() => {
      expect(exportActions.downloadCard).toHaveBeenCalled();
    });
  });
});
