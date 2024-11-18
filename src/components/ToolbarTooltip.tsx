import React from 'react';
import { Tooltip, TooltipProps } from '@mui/material';
import { getHotkeyText } from '@/utils/hotkeys';

interface ToolbarTooltipProps extends Omit<TooltipProps, 'title'> {
  title: string;
  commandKey: string;
}

export const ToolbarTooltip: React.FC<ToolbarTooltipProps> = ({
  title,
  commandKey,
  children,
  ...props
}) => {
  const hotkeyText = getHotkeyText(commandKey);
  const tooltipTitle = hotkeyText ? `${title}${hotkeyText}` : title;

  return (
    <Tooltip
      title={tooltipTitle}
      placement="bottom"
      arrow
      enterDelay={500}
      {...props}
    >
      <span>{children}</span>
    </Tooltip>
  );
}; 