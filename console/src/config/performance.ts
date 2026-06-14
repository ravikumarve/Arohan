// Performance optimization configuration
// Centralized settings for performance optimizations

export const performanceConfig = {
  // Image optimization
  images: {
    lazy: true,
    threshold: 0.1,
    placeholder: 'blur',
    formats: ['webp', 'avif'],
    quality: 85,
    sizes: {
      thumbnail: 100,
      small: 300,
      medium: 600,
      large: 1200,
      xlarge: 1920,
    },
  },

  // Animation optimization
  animations: {
    reducedMotion: true,
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
    },
    easing: 'easeInOut',
  },

  // Virtual scrolling
  virtualScroll: {
    itemHeight: 60,
    overscan: 3,
    threshold: 100,
  },

  // Debounce and throttle
  timing: {
    debounce: {
      search: 300,
      resize: 200,
      scroll: 100,
    },
    throttle: {
      scroll: 100,
      resize: 200,
      input: 150,
    },
  },

  // Code splitting
  codeSplitting: {
    chunks: {
      dashboard: 'dashboard',
      agents: 'agents',
      sessions: 'sessions',
      integrations: 'integrations',
      scorecards: 'scorecards',
      monitoring: 'monitoring',
      settings: 'settings',
    },
    prefetch: 'hover',
    preload: 'visible',
  },

  // Bundle optimization
  bundle: {
    analyze: true,
    compression: true,
    minify: true,
    treeshake: true,
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      framerMotion: 'Motion',
    },
  },

  // Caching strategy
  caching: {
    static: '1 year',
    api: '5 minutes',
    data: '1 hour',
  },

  // Performance monitoring
  monitoring: {
    enabled: true,
    sampleRate: 0.1,
    slowRenderThreshold: 16, // 60fps
    memoryThreshold: 50, // MB
  },

  // Accessibility
  accessibility: {
    reducedMotion: true,
    focusVisible: true,
    keyboardNavigation: true,
    ariaLabels: true,
  },
};

// Performance thresholds
export const performanceThresholds = {
  // Lighthouse scores
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90,
  },

  // Core Web Vitals
  coreWebVitals: {
    LCP: 2.5, // Largest Contentful Paint (seconds)
    FID: 100, // First Input Delay (milliseconds)
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1.8, // First Contentful Paint (seconds)
    TTI: 3.8, // Time to Interactive (seconds)
  },

  // Bundle size
  bundleSize: {
    initial: 200, // KB
    total: 500, // KB
    chunk: 100, // KB
  },

  // Render performance
  render: {
    maxRenderTime: 16, // ms (60fps)
    maxReRenders: 3,
    maxStateUpdates: 10,
  },
};

// Performance optimization utilities
export const performanceUtils = {
  // Check if performance is degraded
  isPerformanceDegraded: (metrics: any) => {
    return (
      metrics.renderTime > performanceThresholds.render.maxRenderTime ||
      metrics.memoryUsage > performanceConfig.monitoring.memoryThreshold
    );
  },

  // Get optimization recommendations
  getRecommendations: (metrics: any) => {
    const recommendations: string[] = [];

    if (metrics.renderTime > performanceThresholds.render.maxRenderTime) {
      recommendations.push('Consider using React.memo or useMemo');
    }

    if (metrics.bundleSize > performanceThresholds.bundleSize.initial) {
      recommendations.push('Consider code splitting or lazy loading');
    }

    if (metrics.reRenderCount > performanceThresholds.render.maxReRenders) {
      recommendations.push('Review component dependencies and useCallback');
    }

    return recommendations;
  },

  // Format performance metrics
  formatMetrics: (metrics: any) => {
    return {
      renderTime: `${metrics.renderTime.toFixed(2)}ms`,
      memoryUsage: `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`,
      bundleSize: `${(metrics.bundleSize / 1024).toFixed(2)}KB`,
      reRenderCount: metrics.reRenderCount,
    };
  },
};
