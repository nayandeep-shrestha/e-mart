'use client';

import { Form, Input, message } from 'antd';
import PrimaryButton from '@/ui/Atoms/PrimaryButton';
import sendOTP from '@/service/auth.service';
import { useRouter } from 'next/navigation';

const { Item } = Form;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await sendOTP(values.email);
      message.success('OTP sent to your mail');
      router.push(`/verify-otp/${response.id}`);
    } catch (error) {
      console.error('Error while creating user:', error);
    }
  };
  return (
    <Form
      className="mb-[1.5rem] w-[28rem]"
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Item label="Email*" name="email">
        <Input
          type="email"
          placeholder="example@example.com"
          required
          className="p-[0.5rem] text-[1.2rem] font-medium"
        />
      </Item>
      <PrimaryButton label="Submit" type="submit" className="mb-12 w-[28rem]" />
    </Form>
  );
}
