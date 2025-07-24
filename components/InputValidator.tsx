import React from 'react';
import { validateContent, validateUserInput } from '../utils/dataValidator';

interface InputValidatorProps {
  value: string;
  onChange: (value: string) => void;
  type: 'search' | 'feedback' | 'general';
  placeholder?: string;
  className?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
}

const InputValidator: React.FC<InputValidatorProps> = ({
  value,
  onChange,
  type,
  placeholder,
  className = '',
  maxLength,
  required = false,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    
    // Apply basic validation and sanitization
    const sanitizedValue = validateUserInput(inputValue, maxLength);
    
    // Additional content validation
    if (validateContent(sanitizedValue, type)) {
      onChange(sanitizedValue);
    } else if (sanitizedValue.length === 0) {
      // Allow empty input for clearing
      onChange('');
    }
    // Otherwise, ignore invalid input (don't update state)
  };

  const baseProps = {
    value,
    onChange: handleChange,
    placeholder,
    required,
    disabled,
    maxLength,
    className: `${className} ${!validateContent(value, type) && value.length > 0 ? 'border-red-500' : ''}`
  };

  if (type === 'feedback') {
    return (
      <textarea
        {...baseProps}
        rows={4}
        aria-label={placeholder || 'ملاحظاتك'}
      />
    );
  }

  return (
    <input
      type="text"
      {...baseProps}
      aria-label={placeholder || 'بحث'}
    />
  );
};

export default InputValidator;