'use client';

import { Form, Input, message } from 'antd';
import PrimaryButton from '@/ui/Atoms/PrimaryButton';
import { resendOTP, verifyOTP } from '@/service/auth.service';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyOTPForm() {
  const [disable, setDisable] = useState(false);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(30);

  const router = useRouter();
  const params = useParams<{ id: string }>();

  const handleSubmit = async (values: { otp: string }) => {
    try {
      setDisable(true);
      const response = await verifyOTP(Number(params.id), values.otp);
      message.success(response.msg);
      router.push(`/change-password/${params.id}`);
    } catch (error) {
      console.error('Error while creating user:', error);
    } finally {
      setDisable(false);
    }
  };
  const resend = async () => {
    try {
      setMinutes(1);
      setSeconds(30);
      await resendOTP(Number(params.id));
    } catch (err) {
      console.log('Respone: ', err);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  return (
    <>
      <Form
        className="mb-0 w-[28rem]"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="otp">
          <Input
            type="text"
            placeholder="Enter OTP"
            required
            className="p-[0.5rem] text-[1.2rem] font-medium"
          />
        </Form.Item>
        <PrimaryButton
          label="Submit"
          type="submit"
          className="mb-5 w-[28rem]"
          disable={disable}
        />
      </Form>
      <div className="countdown-text text-[1rem]">
        {seconds > 0 || minutes > 0 ? (
          <p>
            Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </p>
        ) : (
          <p>Didn&apos;t recieve code?</p>
        )}

        <button
          type="button"
          disabled={seconds > 0 || minutes > 0}
          style={{
            color: seconds > 0 || minutes > 0 ? '#DFE3E8' : '#FF5630',
          }}
          onClick={resend}
        >
          Resend OTP
        </button>
      </div>
    </>
  );
}
