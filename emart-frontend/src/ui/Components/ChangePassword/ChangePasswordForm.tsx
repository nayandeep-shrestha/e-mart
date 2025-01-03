'use client';

import { useRouter, useParams } from 'next/navigation';
import { Form, Input, message } from 'antd';
import { PrimaryButton } from '@/ui/Atoms';
import { changePasswordOTP } from '@/service/auth.service';

const { Item } = Form;
const { Password } = Input;

export default function ChangePasswordForm() {
  const params = useParams();
  const userId = Number(params.id);
  const router = useRouter();

  const handleFormSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      if (!userId) throw new Error('User not valid');
      const response = await changePasswordOTP(userId, values.confirmPassword);
      message.success(response);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form layout="vertical" className="w-full" onFinish={handleFormSubmit}>
      <Item
        label="Password*"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          {
            pattern:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character (e.g., @, $, !).',
          },
        ]}
      >
        <Password
          placeholder="Password"
          required
          className="p-[0.5rem] text-[1.2rem] font-medium"
        />
      </Item>
      <Item
        name="confirmPassword"
        label="Confirm Password*"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('Passwords that you entered do not match!'),
              );
            },
          }),
        ]}
      >
        <Password
          placeholder="Re-type Password"
          className="p-[0.5rem] text-[1.2rem] font-medium"
          required
        />
      </Item>
      <Item>
        <PrimaryButton
          type="submit"
          className="w-full px-4 py-3 text-lg"
          label="Submit"
        />
      </Item>
    </Form>
  );
}
