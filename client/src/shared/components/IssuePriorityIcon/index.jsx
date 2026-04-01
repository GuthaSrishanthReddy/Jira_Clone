import React from 'react';
import PropTypes from 'prop-types';

import { IssuePriority } from 'shared/constants/issues';

import { PriorityIcon } from './Styles';

const propTypes = {
  priority: PropTypes.string.isRequired,
};

const IssuePriorityIcon = ({ priority, ...otherProps }) => {
  const iconType = [IssuePriority.LOW, IssuePriority.LOWEST].includes(priority)
    ? 'arrow-down'
    : 'arrow-up';

  return <PriorityIcon $priority={priority} type={iconType} size={18} {...otherProps} />;
};

IssuePriorityIcon.propTypes = propTypes;

export default IssuePriorityIcon;
