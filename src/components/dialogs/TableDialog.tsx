import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { TableChart } from '@mui/icons-material';

interface TableDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (rows: number, cols: number) => void;
}

export const TableDialog = ({ open, onClose, onConfirm }: TableDialogProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [isSelecting, setIsSelecting] = useState(true);

  const maxRows = 8;
  const maxCols = isSmallScreen ? 6 : 8;

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setHoveredCell({ row, col });
    }
  };

  const handleMouseLeave = () => {
    if (isSelecting) {
      setHoveredCell({ row: 0, col: 0 });
    }
  };

  const handleClick = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCell({ row, col });
      setIsSelecting(false);
    } else {
      // 重新开始选择
      setIsSelecting(true);
      setSelectedCell({ row, col });
    }
  };

  const handleConfirm = () => {
    if (selectedCell.row > 0 && selectedCell.col > 0) {
      onConfirm(selectedCell.row, selectedCell.col);
      resetState();
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const resetState = () => {
    setSelectedCell({ row: 0, col: 0 });
    setHoveredCell({ row: 0, col: 0 });
    setIsSelecting(true);
  };

  const getCellDisplay = (i: number, j: number) => {
    if (!isSelecting && i < selectedCell.row && j < selectedCell.col) {
      return theme.palette.primary.main;
    }
    if (isSelecting && i < hoveredCell.row && j < hoveredCell.col) {
      return theme.palette.mode === 'dark'
        ? theme.palette.primary.dark
        : theme.palette.primary.light;
    }
    return theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)';
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      fullScreen={isSmallScreen}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? 0 : 2,
          margin: isSmallScreen ? 0 : undefined,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          pt: isSmallScreen ? 2 : 0 
        }}>
          <TableChart color="primary" />
          <Typography variant="h6">插入表格</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              textAlign: 'center',
            }}
          >
            {isSelecting 
              ? hoveredCell.row > 0 
                ? `选择表格大小: ${hoveredCell.row} × ${hoveredCell.col}`
                : '请选择表格大小'
              : `已选择: ${selectedCell.row} × ${selectedCell.col} (点击重新选择)`
            }
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 1,
              backgroundColor: theme.palette.background.paper,
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            <Grid container spacing={0.5}>
              {Array.from({ length: maxRows }, (_, i) => (
                <Grid item xs={12} key={i}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {Array.from({ length: maxCols }, (_, j) => (
                      <Box
                        key={j}
                        onClick={() => handleClick(i + 1, j + 1)}
                        onMouseEnter={() => handleMouseEnter(i + 1, j + 1)}
                        sx={{
                          width: isSmallScreen ? 32 : 24,
                          height: isSmallScreen ? 32 : 24,
                          backgroundColor: getCellDisplay(i, j),
                          border: '1px solid',
                          borderColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                          borderRadius: 0.5,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ 
        px: 3, 
        pb: isSmallScreen ? 4 : 2,
        gap: 1,
      }}>
        <Button 
          onClick={handleClose}
          fullWidth={isSmallScreen}
        >
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={selectedCell.row === 0 || selectedCell.col === 0}
          fullWidth={isSmallScreen}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 