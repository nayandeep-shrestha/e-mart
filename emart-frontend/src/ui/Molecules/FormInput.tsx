import { Form, Input } from 'antd';

const { Item } = Form;

export default function FormInput({
  name,
  label,
  placeholder,
  type,
  required = true,
  rules,
}: {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'password';
  required: boolean;
  rules?: Array<{ [key: string]: any }>;
}) {
  return (
    <Item name={name} label={label} rules={rules}>
      {(() => {
        if (type === 'text') {
          return (
            <Input
              placeholder={placeholder}
              className="text-[1.1rem] font-normal"
              required={required}
            />
          );
        }
        if (type === 'password') {
          return (
            <Input.Password
              placeholder={placeholder}
              className="text-[1.1rem] font-normal"
            />
          );
        }
        return null;
      })()}
    </Item>
  );
}

FormInput.defaultProps = {
  rules: [],
};
