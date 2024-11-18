import { Variants } from 'framer-motion';

// 页面过渡动画
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1], // Material Design 标准缓动函数
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// 卡片悬浮动画
export const hoverCard: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hover: {
    scale: 1.01,
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// 侧边栏展开/收起动画
export const sidebarAnimation: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.02,
    },
  },
  closed: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// 工具栏淡入淡出动画
export const toolbarAnimation: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  hidden: {
    opacity: 0,
    y: -5,
    transition: {
      duration: 0.1,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// 列表项动画
export const listItemAnimation: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.15,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

// 弹出动画
export const popAnimation: Variants = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// 波纹效果动画
export const rippleAnimation: Variants = {
  start: {
    scale: [1, 1.5],
    opacity: [0.5, 0],
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// 滑动动画
export const slideAnimation: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  }),
}; 