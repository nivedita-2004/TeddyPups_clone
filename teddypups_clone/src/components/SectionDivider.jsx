/**
 * SectionDivider Component
 * Reproduces reference section boundaries with original vector illustrations.
 * Variants: 'curtain' | 'quilt' | 'hem' | 'wave' | 'skyline'
 */
export default function SectionDivider({
  variant = 'quilt',
  className = '',
  fillColor,
  flip = false,
  height = '36px',
}) {
  const transformStyle = flip ? 'rotate(180deg)' : undefined;

  if (variant === 'wave') {
    return (
      <div
        className={`tp-divider tp-divider--wave ${className}`}
        style={{ width: '100%', overflow: 'hidden', lineHeight: 0, transform: transformStyle }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          style={{ width: '100%', height: height, display: 'block', fill: fillColor || 'var(--color-night)' }}
        >
          <path d="M0 80V44c120-30 240-44 360-30s240 46 360 34 240-58 360-46 240 40 360 26v52z" />
        </svg>
      </div>
    );
  }

  if (variant === 'quilt') {
    return (
      <div
        className={`tp-divider tp-divider--quilt ${className}`}
        style={{
          width: '100%',
          height: '24px',
          backgroundImage: "url('/assets/illustrations/scallop-quilt.svg')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center',
          backgroundSize: '48px 24px',
          transform: transformStyle,
          opacity: 0.85,
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'curtain') {
    return (
      <div
        className={`tp-divider tp-divider--curtain ${className}`}
        style={{
          width: '100%',
          height: '28px',
          backgroundImage: "url('/assets/illustrations/scallop-curtain.svg')",
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'top center',
          backgroundSize: '56px 28px',
          transform: transformStyle,
        }}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'skyline') {
    return (
      <div
        className={`tp-divider tp-divider--skyline ${className}`}
        style={{ width: '100%', overflow: 'hidden', lineHeight: 0 }}
        aria-hidden="true"
      >
        <img
          src="/assets/illustrations/city-silhouette.svg"
          alt=""
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    );
  }

  // default: hem
  return (
    <div
      className={`tp-divider tp-divider--hem ${className}`}
      style={{
        width: '100%',
        height: '14px',
        backgroundImage: "url('/assets/illustrations/scallop-hem.svg')",
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        transform: transformStyle,
      }}
      aria-hidden="true"
    />
  );
}

