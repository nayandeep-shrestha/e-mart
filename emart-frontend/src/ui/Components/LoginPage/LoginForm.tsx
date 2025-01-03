'use client';

import { useContext, useState } from 'react';
import { Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';
import { PrimaryButton } from '@/ui/Atoms';
import { axiosInstance } from '@/service/axiosInstance';
import { AuthContext } from '@/context';

const { Item } = Form;
const { Password } = Input;

export default function LoginForm() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [formState, setFormState] = useState({
    values: {
      email: '',
      password: '',
    },
    errors: {
      email: '',
      password: '',
    },
  });

  const validateEmail = (email: string) => {
    if (!email) {
      return 'Email is required';
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return 'Invalid email';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      values: {
        ...prevState.values,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: validateField(name, value),
      },
    }));
  };

  const handleSubmit = async () => {
    const { email, password } = formState.values;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setFormState((prevState) => ({
        ...prevState,
        errors: {
          email: emailError,
          password: passwordError,
        },
      }));
      return;
    }

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: '/auth/admin/login',
        data: formState.values,
      });
      message.success(response.data.msg);
      document.cookie = `accessToken=${response.data.result.accessToken}; HttpOnly; Path=/;`;

      localStorage.setItem('accessToken', response.data.result.accessToken);
      authContext?.setAccessToken(response.data.result.accessToken);
      router.push('/admin/orders');
    } catch (error: any) {
      message.error(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Form layout="vertical" className="w-full" onFinish={handleSubmit}>
      <Item
        label="Email*"
        validateStatus={formState.errors.email ? 'error' : ''}
        help={formState.errors.email}
      >
        <Input
          id="email"
          name="email"
          type="text"
          placeholder="example@example.com"
          value={formState.values.email}
          onChange={handleChange}
          required
          className="p-[0.5rem] text-[1.2rem] font-medium"
        />
      </Item>
      <Item
        label="Password*"
        validateStatus={formState.errors.password ? 'error' : ''}
        help={formState.errors.password}
      >
        <Password
          id="password"
          name="password"
          placeholder="Password"
          value={formState.values.password}
          onChange={handleChange}
          required
          className="p-[0.5rem] text-[1.2rem] font-medium"
        />
      </Item>
      <Item>
        <PrimaryButton
          type="submit"
          className="w-full px-4 py-3 text-lg"
          label="Login"
        />
      </Item>
    </Form>
  );
}
