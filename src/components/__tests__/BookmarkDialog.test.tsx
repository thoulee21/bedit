import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkDialog } from '../dialogs/BookmarkDialog';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Bookmark } from '@/types/bookmark';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

describe('BookmarkDialog', () => {
  const mockBookmarks: Bookmark[] = [
    { id: '1', title: 'Test Bookmark 1', timestamp: Date.now() },
    { id: '2', title: 'Test Bookmark 2', timestamp: Date.now() },
  ];

  const onClose = jest.fn();
  const onDeleteBookmark = jest.fn();
  const onSelectBookmark = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no bookmarks', () => {
    render(
      <ThemeProvider theme={theme}>
        <BookmarkDialog
          open={true}
          onClose={onClose}
          bookmarks={[]}
          onDeleteBookmark={onDeleteBookmark}
          onSelectBookmark={onSelectBookmark}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('暂无书签')).toBeInTheDocument();
  });

  it('renders bookmarks list correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <BookmarkDialog
          open={true}
          onClose={onClose}
          bookmarks={mockBookmarks}
          onDeleteBookmark={onDeleteBookmark}
          onSelectBookmark={onSelectBookmark}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Test Bookmark 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bookmark 2')).toBeInTheDocument();
  });

  it('handles bookmark deletion', () => {
    render(
      <ThemeProvider theme={theme}>
        <BookmarkDialog
          open={true}
          onClose={onClose}
          bookmarks={mockBookmarks}
          onDeleteBookmark={onDeleteBookmark}
          onSelectBookmark={onSelectBookmark}
        />
      </ThemeProvider>
    );

    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);
    expect(onDeleteBookmark).toHaveBeenCalledWith('1');
  });

  it('handles bookmark selection', () => {
    render(
      <ThemeProvider theme={theme}>
        <BookmarkDialog
          open={true}
          onClose={onClose}
          bookmarks={mockBookmarks}
          onDeleteBookmark={onDeleteBookmark}
          onSelectBookmark={onSelectBookmark}
        />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Test Bookmark 1'));
    expect(onSelectBookmark).toHaveBeenCalledWith(mockBookmarks[0]);
  });
}); 