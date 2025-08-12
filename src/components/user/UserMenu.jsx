// src/components/user/UserMenu.jsx
import { memo } from "react";
import PropTypes from "prop-types";
import "../../css/user/UserMenu.module.css";

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
