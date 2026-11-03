import { Link } from 'react-router-dom';


export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  className = '',
  onClick,
  type = 'button',
  icon,
  target,
  rel,
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const combinedClasses = `btn ${variantClass} ${className}`.trim();

  const content = (
    <>
      {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={target || (href.startsWith('http') ? '_blank' : undefined)}
        rel={rel || (href.startsWith('http') ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClasses} onClick={onClick} {...props}>
      {content}
    </button>
  );
}

