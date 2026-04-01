import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { color } from 'shared/utils/styles';
import Icon from 'shared/components/Icon';

import { StyledButton, StyledSpinner, Text } from './Styles';

const propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'secondary', 'empty']),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconSize: PropTypes.number,
  disabled: PropTypes.bool,
  isWorking: PropTypes.bool,
  onClick: PropTypes.func,
};

const Button = forwardRef(
  (
    {
      children,
      className,
      variant = 'secondary',
      icon,
      iconSize = 18,
      disabled = false,
      isWorking = false,
      onClick = () => {},
      isActive,
      ...buttonProps
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled && !isWorking) {
        onClick();
      }
    };

    return (
      <StyledButton
        {...buttonProps}
        className={className}
        onClick={handleClick}
        $iconOnly={!children}
        $isActive={isActive}
        $isWorking={isWorking}
        $variant={variant}
        disabled={disabled || isWorking}
        ref={ref}
      >
        {isWorking && <StyledSpinner size={26} color={getIconColor(variant)} />}

        {!isWorking && icon && typeof icon === 'string' ? (
          <Icon type={icon} size={iconSize} color={getIconColor(variant)} />
        ) : (
          icon
        )}
        {children && <Text $withPadding={isWorking || icon}>{children}</Text>}
      </StyledButton>
    );
  },
);

const getIconColor = variant =>
  ['secondary', 'empty'].includes(variant) ? color.textDark : '#fff';

Button.propTypes = propTypes;

export default Button;
