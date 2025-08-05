// src/components/user/UserMenu.jsx
import { memo } from "react";
import PropTypes from "prop-types";

const UserMenu = memo(({ items = [], disabled = false }) => {
  if (!items || items.length === 0) {
    return (
      <div className="user-menu empty">
        <p className="empty-message">메뉴 항목이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="user-menu">
      <div className="menu-list">
        {items.map(item => (
          <MenuItem key={item.id} item={item} disabled={disabled} />
        ))}
      </div>

      <style>{`
        .user-menu {
          width: 100%;
        }

        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .empty-message {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
});

const MenuItem = memo(({ item, disabled }) => {
  const {
    icon,
    title,
    description,
    onClick,
    isDestructive = false,
    badge = null,
    isNew = false,
  } = item;

  const handleClick = e => {
    e.preventDefault();
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <button
      className={`menu-item ${isDestructive ? "destructive" : ""} ${disabled ? "disabled" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      type="button"
      role="menuitem"
      aria-label={`${title}: ${description}`}
    >
      <div className="menu-icon">{icon}</div>

      <div className="menu-content">
        <div className="menu-title-wrapper">
          <h3 className="menu-title">
            {title}
            {isNew && <span className="new-badge">NEW</span>}
          </h3>
          {badge && <span className="menu-badge">{badge}</span>}
        </div>
        <p className="menu-description">{description}</p>
      </div>

      <div className="menu-arrow">
        <span>›</span>
      </div>

      <style>{`
        .menu-item {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          padding: 16px 20px;
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .menu-item:hover:not(.disabled) {
          background: #f8fafc;
          transform: translateX(4px);
        }

        .menu-item:active:not(.disabled) {
          transform: translateX(4px) scale(0.98);
        }

        .menu-item.destructive:hover:not(.disabled) {
          background: #fef2f2;
          border-color: #fee2e2;
        }

        .menu-item.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .menu-item:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background: #f8fafc;
        }

        .menu-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .menu-item:hover:not(.disabled) .menu-icon {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .menu-item.destructive .menu-icon {
          background: #fee2e2;
        }

        .menu-item.destructive:hover:not(.disabled) .menu-icon {
          background: #fecaca;
        }

        .menu-icon img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .menu-content {
          flex: 1;
          min-width: 0;
        }

        .menu-title-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .menu-title {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .menu-item.destructive .menu-title {
          color: #dc2626;
        }

        .new-badge {
          background: #10b981;
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .menu-badge {
          background: #3b82f6;
          color: white;
          font-size: 12px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 6px;
          margin-left: auto;
        }

        .menu-description {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .menu-item.destructive .menu-description {
          color: #991b1b;
        }

        .menu-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: #9ca3af;
          font-size: 18px;
          font-weight: bold;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .menu-item:hover:not(.disabled) .menu-arrow {
          color: #6b7280;
          transform: translateX(2px);
        }

        .menu-item.destructive .menu-arrow {
          color: #dc2626;
        }

        /* 리플 효과 */
        .menu-item::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition:
            width 0.3s ease,
            height 0.3s ease;
          pointer-events: none;
        }

        .menu-item:active:not(.disabled)::before {
          width: 200px;
          height: 200px;
        }

        .menu-item.destructive:active:not(.disabled)::before {
          background: rgba(220, 38, 38, 0.1);
        }

        /* 다크 모드 */
        @media (prefers-color-scheme: dark) {
          .menu-item:hover:not(.disabled) {
            background: #374151;
          }

          .menu-item:focus {
            background: #374151;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
          }

          .menu-icon {
            background: #374151;
          }

          .menu-item:hover:not(.disabled) .menu-icon {
            background: #4b5563;
          }

          .menu-item.destructive .menu-icon {
            background: #450a0a;
          }

          .menu-item.destructive:hover:not(.disabled) .menu-icon {
            background: #7f1d1d;
          }

          .menu-item.destructive:hover:not(.disabled) {
            background: #450a0a;
          }

          .menu-title {
            color: #f9fafb;
          }

          .menu-description {
            color: #d1d5db;
          }

          .menu-item.destructive .menu-description {
            color: #f87171;
          }

          .menu-arrow {
            color: #6b7280;
          }

          .menu-item:hover:not(.disabled) .menu-arrow {
            color: #9ca3af;
          }
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .menu-item {
            padding: 14px 16px;
            gap: 12px;
          }

          .menu-icon {
            width: 44px;
            height: 44px;
          }

          .menu-icon img {
            width: 22px;
            height: 22px;
          }

          .menu-title {
            font-size: 15px;
          }

          .menu-description {
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .menu-item {
            padding: 12px 16px;
            gap: 10px;
          }

          .menu-icon {
            width: 40px;
            height: 40px;
          }

          .menu-icon img {
            width: 20px;
            height: 20px;
          }

          .menu-title {
            font-size: 14px;
          }

          .menu-description {
            font-size: 12px;
          }

          .menu-arrow {
            width: 20px;
            height: 20px;
            font-size: 16px;
          }
        }

        /* 접근성 개선 */
        @media (prefers-reduced-motion: reduce) {
          .menu-item,
          .menu-icon,
          .menu-arrow,
          .menu-item::before {
            transition: none;
          }
        }

        /* 고대비 모드 */
        @media (prefers-contrast: high) {
          .menu-item {
            border: 2px solid transparent;
          }

          .menu-item:focus {
            border-color: #2563eb;
            box-shadow: none;
          }

          .menu-item.destructive:focus {
            border-color: #dc2626;
          }
        }
      `}</style>
    </button>
  );
});

MenuItem.displayName = "MenuItem";
UserMenu.displayName = "UserMenu";

UserMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      isDestructive: PropTypes.bool,
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      isNew: PropTypes.bool,
    }),
  ).isRequired,
  disabled: PropTypes.bool,
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isDestructive: PropTypes.bool,
    badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isNew: PropTypes.bool,
  }).isRequired,
  disabled: PropTypes.bool,
};

export default UserMenu;
