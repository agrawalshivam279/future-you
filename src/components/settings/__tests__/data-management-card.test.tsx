import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DataManagementCard } from '../data-management-card';
import * as dataManager from '@/lib/storage/data-manager';

const mockShowToast = jest.fn();

jest.mock('@/components/ui/toast', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/lib/storage/data-manager', () => ({
  downloadDataAsJSON: jest.fn(),
  deleteAllLocalData: jest.fn().mockResolvedValue(undefined),
}));

describe('DataManagementCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the data management card and actions', () => {
    render(<DataManagementCard />);

    expect(screen.getByText('Data & Privacy Management')).toBeInTheDocument();
    expect(screen.getByText('Export Data Backup')).toBeInTheDocument();
    expect(screen.getByText('Delete All Stored Data')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /export all local data as json/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open delete all data confirmation dialog/i })
    ).toBeInTheDocument();
  });

  it('triggers downloadDataAsJSON and shows success toast when export button is clicked', () => {
    render(<DataManagementCard />);

    const exportBtn = screen.getByRole('button', { name: /export all local data as json/i });
    fireEvent.click(exportBtn);

    expect(dataManager.downloadDataAsJSON).toHaveBeenCalledTimes(1);
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        message: expect.stringMatching(/exported to a json backup/i),
      })
    );
  });

  it('opens confirmation modal when delete button is clicked and cancels correctly', () => {
    render(<DataManagementCard />);

    const deleteBtn = screen.getByRole('button', {
      name: /open delete all data confirmation dialog/i,
    });
    fireEvent.click(deleteBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Permanently Delete All Data?')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancel data deletion/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(dataManager.deleteAllLocalData).not.toHaveBeenCalled();
  });

  it('confirms and calls deleteAllLocalData with toast feedback', async () => {
    render(<DataManagementCard />);

    const deleteBtn = screen.getByRole('button', {
      name: /open delete all data confirmation dialog/i,
    });
    fireEvent.click(deleteBtn);

    const confirmBtn = screen.getByRole('button', {
      name: /confirm permanent deletion of all data/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(dataManager.deleteAllLocalData).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          message: expect.stringMatching(/all local data.*have been erased/i),
        })
      );
    });
  });
});
