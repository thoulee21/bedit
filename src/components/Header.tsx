import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleDarkMode } from '@/store/preferencesSlice';
import { insertLink, insertTable } from '@/utils/editor-utils';
import { Chat as ChatIcon, Edit, FormatListBulleted } from '@mui/icons-material';
import { AppBar, Box, Divider, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Descendant, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { LinkDialog } from './dialogs/LinkDialog';
import { TableDialog } from './dialogs/TableDialog';
import { MaterialUISwitch } from './MaterialUISwitch';
import { MoreToolsMenu } from './MoreToolsMenu';
import { createToolbarItems, type ToolbarItem } from './toolbar-items';

interface HeaderProps {
  editor: Editor & ReactEditor;
  setValue: (value: Descendant[]) => void;
  onToggleOutline: () => void;
  onToggleChat: () => void;
  showOutline: boolean;
  showChat: boolean;
  isSmallScreen: boolean;
}

export const Header = ({
  editor,
  setValue,
  onToggleOutline,
  onToggleChat,
  showOutline,
  showChat,
  isSmallScreen
}: HeaderProps) => {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useAppSelector(state => state.preferences.prefersDarkMode);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [visibleTools, setVisibleTools] = useState<ToolbarItem[]>([]);
  const [overflowTools, setOverflowTools] = useState<ToolbarItem[]>([]);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const toolbarEvents = useMemo(() => ({
    openLinkDialog: () => setLinkDialogOpen(true),
    openTableDialog: () => setTableDialogOpen(true),
  }), []);

  const allToolbarItems = useMemo(() =>
    createToolbarItems(editor, toolbarEvents),
    [editor, toolbarEvents]
  );

  // 计算哪些工具需要折叠
  const updateToolbarLayout = useCallback(() => {
    if (!toolbarRef.current) return;

    const toolbarWidth = toolbarRef.current.offsetWidth;
    const itemWidth = isSmallScreen ? 32 : 40;
    const maxItems = Math.floor((toolbarWidth - 40) / itemWidth); // 减去更多按钮的宽度

    const essentialTools = ['bold', 'italic', 'underline'];
    const visibleItems: ToolbarItem[] = [];
    const overflowItems: ToolbarItem[] = [];

    allToolbarItems.forEach(item => {
      if (item.type === 'separator') return;

      if (essentialTools.includes(item.key) || visibleItems.length < maxItems - 1) {
        visibleItems.push(item);
      } else {
        overflowItems.push(item);
      }
    });

    setVisibleTools(visibleItems);
    setOverflowTools(overflowItems);
  }, [isSmallScreen, allToolbarItems]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = debounce(() => {
      requestAnimationFrame(updateToolbarLayout);
    }, 100);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateToolbarLayout]);

  // 初始布局计算
  useEffect(() => {
    requestAnimationFrame(updateToolbarLayout);
  }, [updateToolbarLayout]);

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      {...stylex.props(styles.appBar)}
    >
      <Toolbar
        variant="dense"
        {...stylex.props(styles.toolbar, isSmallScreen && styles.toolbarMobile)}
      >
        <Stack
          direction="row"
          spacing={isSmallScreen ? 0.5 : 1}
          alignItems="center"
        >
          <Edit
            color="primary"
            sx={{
              fontSize: isSmallScreen ? 24 : 28,
              ml: isSmallScreen ? -0.5 : 0,
            }}
          />
          <Typography {...stylex.props(styles.title)}>
            BEdit
          </Typography>
        </Stack>

        {isSmallScreen && (
          <Stack direction="row" spacing={0.5}>
            <IconButton
              onClick={onToggleOutline}
              color={showOutline ? 'primary' : 'default'}
              size="small"
              sx={{ padding: '6px' }}
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
            <IconButton
              onClick={onToggleChat}
              color={showChat ? 'primary' : 'default'}
              size="small"
              sx={{ padding: '6px' }}
            >
              <ChatIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        <Divider orientation="vertical" flexItem />

        <Stack
          ref={toolbarRef}
          direction="row"
          spacing={0.5}
          {...stylex.props(styles.toolbarContent)}
          sx={{
            '& .MuiIconButton-root': {
              padding: isSmallScreen ? '6px' : '8px',
            },
          }}
        >
          {visibleTools.map((item) => (
            <IconButton
              key={item.key}
              size="small"
              onClick={item.onSelect}
              disabled={item.disabled}
              color={item.active ? 'primary' : 'default'}
              {...stylex.props(styles.toolbarItem)}
            >
              {item.icon}
            </IconButton>
          ))}

          {overflowTools.length > 0 && (
            <MoreToolsMenu tools={overflowTools} />
          )}
        </Stack>

        <Box sx={{ ml: 'auto' }}>
          <MaterialUISwitch
            checked={prefersDarkMode}
            onChange={() => dispatch(toggleDarkMode())}
            size={isSmallScreen ? 'small' : 'medium'}
          />
        </Box>
      </Toolbar>

      <LinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onConfirm={(url, text) => {
          insertLink(editor, url, text);
          setLinkDialogOpen(false);
        }}
      />

      <TableDialog
        open={tableDialogOpen}
        onClose={() => setTableDialogOpen(false)}
        onConfirm={(rows, cols) => {
          insertTable(editor, rows, cols);
          setTableDialogOpen(false);
        }}
      />
    </AppBar>
  );
};

const styles = stylex.create({
  appBar: {
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid var(--divider-color)',
    zIndex: 1300,
  },
  darkAppBar: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  lightAppBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  toolbar: {
    minHeight: {
      default: '64px',
      '@media (max-width: 600px)': '56px',
    },
    display: 'flex',
    gap: '16px',
  },
  toolbarMobile: {
    padding: '0 8px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--primary-color)',
    fontWeight: 600,
    fontSize: {
      default: '1.25rem',
      '@media (max-width: 600px)': '1rem',
    },
  },
  toolbarContent: {
    flexWrap: 'wrap',
    gap: '4px',
    flex: 1,
  },
  toolbarItem: {
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-1px)',
    },
  },
});

// 防抖函数
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}