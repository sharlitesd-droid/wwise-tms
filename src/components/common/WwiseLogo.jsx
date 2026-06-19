import wwiseLogo from '../../assets/blueLogo.png';
import './WwiseLogo.css';

export default function WwiseLogo({ variant = 'default', className = '' }) {
  return (
    <div className={`wwise-logo wwise-logo--${variant} ${className}`.trim()}>
      <img src={wwiseLogo} alt="WWISE" className="wwise-logo-img" />
      {variant === 'sidebar' && (
        <div className="wwise-logo-tagline">
          <span className="wwise-logo-divider" />
          <span>Task Management</span>
        </div>
      )}
    </div>
  );
}
