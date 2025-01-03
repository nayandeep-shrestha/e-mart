import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';

type ButtonProps = {
  type?: 'submit' | 'reset' | 'button';
  label: string;
  className: string;
  icon?: IconDefinition | null;
  disable?: boolean;
};

export default function PrimaryButton({
  label,
  type = 'button',
  className,
  icon = null,
  disable = false,
}: ButtonProps) {
  return (
    <Button
      htmlType={type}
      className={`shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white ${className}`}
      icon={icon ? <FontAwesomeIcon icon={icon} /> : null}
      disabled={disable}
    >
      {label}
    </Button>
  );
}
