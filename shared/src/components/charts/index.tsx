import React from 'react';
import Card from '../ui/Card';

// Bar Chart Component
interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  className?: string;
}

export function BarChart({
  data,
  title,
  height = 200,
  showLabels = true,
  showValues = true,
  className = '',
}: BarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div style={{ height: `${height}px` }} className="flex items-end gap-2">
        {data.map((item, index) => {
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          const color = item.color || 'bg-recruiter-primary';

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {showValues && (
                <span className="text-xs text-white font-medium">{item.value}</span>
              )}
              <div
                className={`w-full ${color} rounded-t-lg transition-all hover:opacity-80`}
                style={{ height: `${percentage}%` }}
              />
              {showLabels && (
                <span className="text-xs text-recruiter-primary-light text-center truncate w-full">
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Line Chart Component
interface LineChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
  title?: string;
  height?: number;
  showLabels?: boolean;
  showPoints?: boolean;
  className?: string;
  color?: string;
}

export function LineChart({
  data,
  title,
  height = 200,
  showLabels = true,
  showPoints = true,
  className = '',
  color = 'bg-recruiter-primary',
}: LineChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue || 1;

  // Generate SVG path
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div style={{ height: `${height}px` }} className="relative">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          ))}
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke={color.replace('bg-', '').replace('/20', '').replace('/30', '')}
            strokeWidth="2"
          />
          {/* Points */}
          {showPoints &&
            data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={color.replace('bg-', '').replace('/20', '').replace('/30', '')}
                />
              );
            })}
        </svg>
        {/* X-axis labels */}
        {showLabels && (
          <div className="flex justify-between mt-2">
            {data.map((item, index) => (
              <span
                key={index}
                className="text-xs text-recruiter-primary-light text-center"
                style={{ width: `${100 / data.length}%` }}
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// Pie Chart Component
interface PieChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title?: string;
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function PieChart({
  data,
  title,
  size = 200,
  showLabels = true,
  showLegend = true,
  className = '',
}: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate pie slices
  let cumulativePercentage = 0;
  const slices = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

  // Generate SVG paths
  const paths = slices.map((slice) => {
    const startRad = (slice.startAngle * Math.PI) / 180;
    const endRad = (slice.endAngle * Math.PI) / 180;

    const x1 = 50 + 50 * Math.cos(startRad);
    const y1 = 50 + 50 * Math.sin(startRad);
    const x2 = 50 + 50 * Math.cos(endRad);
    const y2 = 50 + 50 * Math.sin(endRad);

    const largeArcFlag = slice.percentage > 50 ? 1 : 0;

    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  });

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-center gap-6">
        <div style={{ width: `${size}px`, height: `${size}px` }} className="relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {paths.map((path, index) => (
              <path
                key={index}
                d={path}
                fill={slices[index].color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
          {/* Center label */}
          {showLabels && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{total}</span>
            </div>
          )}
        </div>
        {showLegend && (
          <div className="flex-1 space-y-2">
            {slices.map((slice, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-white text-sm">{slice.label}</span>
                <span className="text-recruiter-primary-light text-sm">
                  ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// Donut Chart Component
interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  title?: string;
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function DonutChart({
  data,
  title,
  size = 200,
  innerRadius = 60,
  showLabels = true,
  showLegend = true,
  className = '',
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate pie slices
  let cumulativePercentage = 0;
  const slices = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
    };
  });

  // Generate SVG paths
  const paths = slices.map((slice) => {
    const startRad = (slice.startAngle * Math.PI) / 180;
    const endRad = (slice.endAngle * Math.PI) / 180;

    const outerRadius = 50;
    const innerRadiusPercent = (innerRadius / size) * 100;

    const x1 = 50 + outerRadius * Math.cos(startRad);
    const y1 = 50 + outerRadius * Math.sin(startRad);
    const x2 = 50 + outerRadius * Math.cos(endRad);
    const y2 = 50 + outerRadius * Math.sin(endRad);

    const x3 = 50 + innerRadiusPercent * Math.cos(endRad);
    const y3 = 50 + innerRadiusPercent * Math.sin(endRad);
    const x4 = 50 + innerRadiusPercent * Math.cos(startRad);
    const y4 = 50 + innerRadiusPercent * Math.sin(startRad);

    const largeArcFlag = slice.percentage > 50 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadiusPercent} ${innerRadiusPercent} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  });

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="flex items-center gap-6">
        <div style={{ width: `${size}px`, height: `${size}px` }} className="relative">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {paths.map((path, index) => (
              <path
                key={index}
                d={path}
                fill={slices[index].color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
          {/* Center label */}
          {showLabels && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white font-bold text-lg">{total}</span>
                <p className="text-recruiter-primary-light text-xs">Total</p>
              </div>
            </div>
          )}
        </div>
        {showLegend && (
          <div className="flex-1 space-y-2">
            {slices.map((slice, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-white text-sm">{slice.label}</span>
                <span className="text-recruiter-primary-light text-sm">
                  ({slice.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  height?: number;
  className?: string;
}

export function ProgressBar({
  value,
  total,
  label,
  showPercentage = true,
  color = 'bg-recruiter-primary',
  height = 8,
  className = '',
}: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-white">{label}</span>}
          {showPercentage && <span className="text-recruiter-primary-light">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className="w-full bg-recruiter-background-tertiary rounded-full" style={{ height: `${height}px` }}>
        <div
          className={`${color} rounded-full transition-all`}
          style={{ width: `${percentage}%`, height: `${height}px` }}
        />
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  trendUp = true,
  color = 'recruiter-primary',
  className = '',
}: MetricCardProps) {
  const colorClasses = {
    'recruiter-primary': 'bg-recruiter-primary/20 text-recruiter-primary',
    'recruiter-success': 'bg-recruiter-success/20 text-recruiter-success',
    'recruiter-info': 'bg-recruiter-info/20 text-recruiter-info',
    'recruiter-warning': 'bg-recruiter-warning/20 text-recruiter-warning',
    'recruiter-danger': 'bg-recruiter-danger/20 text-recruiter-danger',
    'admin-primary': 'bg-admin-primary/20 text-admin-primary',
    'admin-success': 'bg-admin-success/20 text-admin-success',
    'admin-info': 'bg-admin-info/20 text-admin-info',
    'admin-warning': 'bg-admin-warning/20 text-admin-warning',
    'admin-danger': 'bg-admin-danger/20 text-admin-danger',
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-recruiter-success' : 'text-recruiter-danger'}`}>
            {trendUp ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-recruiter-primary-light mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </Card>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  color = 'recruiter-primary',
  className = '',
}: StatCardProps) {
  const colorClasses = {
    'recruiter-primary': 'bg-recruiter-primary/20 text-recruiter-primary',
    'recruiter-success': 'bg-recruiter-success/20 text-recruiter-success',
    'recruiter-info': 'bg-recruiter-info/20 text-recruiter-info',
    'recruiter-warning': 'bg-recruiter-warning/20 text-recruiter-warning',
    'recruiter-danger': 'bg-recruiter-danger/20 text-recruiter-danger',
    'admin-primary': 'bg-admin-primary/20 text-admin-primary',
    'admin-success': 'bg-admin-success/20 text-admin-success',
    'admin-info': 'bg-admin-info/20 text-admin-info',
    'admin-warning': 'bg-admin-warning/20 text-admin-warning',
    'admin-danger': 'bg-admin-danger/20 text-admin-danger',
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-recruiter-primary-light mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-recruiter-primary-light">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}

// Gauge Chart Component
interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  size?: number;
  showLabels?: boolean;
  color?: string;
  className?: string;
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  title,
  size = 200,
  showLabels = true,
  color = 'bg-recruiter-primary',
  className = '',
}: GaugeChartProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 180;

  return (
    <Card className={`p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>}
      <div className="flex flex-col items-center">
        <div style={{ width: `${size}px`, height: `${size / 2}px` }} className="relative">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            {/* Value arc */}
            <path
              d={`M 10 50 A 40 40 0 0 1 ${10 + 40 * (1 - Math.cos((angle * Math.PI) / 180))} ${50 - 40 * Math.sin((angle * Math.PI) / 180)}`}
              fill="none"
              stroke={color.replace('bg-', '').replace('/20', '').replace('/30', '')}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          {/* Value label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <span className="text-3xl font-bold text-white">{value}</span>
            {showLabels && (
              <div className="text-center">
                <span className="text-recruiter-primary-light text-xs">
                  {min} - {max}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}