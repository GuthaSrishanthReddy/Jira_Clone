import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import TextareaAutoSize from 'react-textarea-autosize';

import { StyledTextarea } from './Styles';

const propTypes = {
  className: PropTypes.string,
  invalid: PropTypes.bool,
  minRows: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Textarea = forwardRef(
  ({ className, invalid = false, onChange = () => {}, ...textareaProps }, ref) => (
    <StyledTextarea $invalid={invalid} className={className}>
      <TextareaAutoSize
        {...textareaProps}
        onChange={event => onChange(event.target.value, event)}
        inputRef={ref || undefined}
      />
    </StyledTextarea>
  ),
);

Textarea.propTypes = propTypes;

export default Textarea;
