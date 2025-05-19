import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/shared/utils/classMerger'; // Assuming this path is correct for your project's cn utility

export interface IEditableTextProps {
  initialValue: string | number;
  onSave: (newValue: string) => void;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  inputClassName?: string;
  displayTextPlaceholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'onBlur' | 'onKeyDown' | 'className' | 'ref'
  >;
}

/**
 * A component that displays text that can be edited in place.
 * It appears as normal text until clicked (or focused and Enter/Space is pressed),
 * then transforms into an input field.
 */
export const EditableText: React.FC<IEditableTextProps> = ({
  initialValue,
  onSave,
  as = 'span',
  className,
  inputClassName,
  type = 'text',
  displayTextPlaceholder = 'Click to edit',
  inputProps,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<string | number>(
    initialValue,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const TextWrapper = as;

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(initialValue);
    }
  }, [initialValue, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    onSave(currentValue.toString());
  };

  const handleCancel = () => {
    setCurrentValue(initialValue); // Revert to the last known good state (initialValue prop)
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if inside a form
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleTextClick = () => {
    setIsEditing(true);
  };

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={currentValue}
        onChange={handleInputChange}
        onBlur={handleSave}
        onKeyDown={handleInputKeyDown}
        spellCheck="false"
        className={cn(
          className,
          'bg-transparent border-input focus:border-primary outline-none',
          'text-inherit font-inherit m-0',
          'min-w-[50px]',
          'underline underline-offset-2 decoration-dashed decoration-muted-foreground',
          type === 'number' &&
            'appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0',
          inputClassName,
        )}
        {...inputProps}
      />
    );
  }

  const displayValue =
    String(currentValue).trim() === '' ? displayTextPlaceholder : currentValue;

  return (
    <TextWrapper
      onClick={handleTextClick}
      onKeyDown={handleTextKeyDown}
      className={cn(
        'cursor-text hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors underline underline-offset-2  decoration-muted-foreground',
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'text-muted-foreground italic':
            String(currentValue).trim() === '' &&
            displayValue === displayTextPlaceholder,
        },
        className,
      )}
      tabIndex={0}
      role="button"
      aria-label={`Edit text. Current value: ${String(currentValue).trim() === '' ? 'empty, placeholder is ' + displayTextPlaceholder : currentValue}`}
    >
      {displayValue}
    </TextWrapper>
  );
};
