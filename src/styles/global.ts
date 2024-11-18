import { css } from '@emotion/react';

export const globalStyles = (isDarkMode: boolean) => css`
  /* 滚动条整体样式 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: ${isDarkMode ? '#2d2d2d' : '#f1f1f1'};
    border-radius: 4px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    background: ${isDarkMode ? '#555' : '#c1c1c1'};
    border-radius: 4px;
    transition: background 0.2s;

    &:hover {
      background: ${isDarkMode ? '#666' : '#a1a1a1'};
    }
  }

  /* 滚动条两端按钮 */
  ::-webkit-scrollbar-button {
    display: none;
  }

  /* 横向滚动条和纵向滚动条相交处 */
  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* 整体页面滚动行为 */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${isDarkMode ? '#555 #2d2d2d' : '#c1c1c1 #f1f1f1'};
  }
`; 