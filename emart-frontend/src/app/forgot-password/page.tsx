'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '@/ui/Molecules';
import { ForgotPasswordForm } from '@/ui/Components';

export default function ForgotPassword() {
  return (
    <div className="relative flex h-[100vh] flex-col items-center justify-center px-[2rem]">
      <div className="mb-12 flex flex-col items-center text-center">
        <Logo width={250} height={250} className="mb-6 rounded" />
        <div className="w-full text-center">
          <h2 className="mb-3 text-3xl">Forgot Password?</h2>
          <span className="text-md text-gray-500">
            Please provide the email associated with your account.
          </span>
        </div>
      </div>
      <ForgotPasswordForm />
      <Link
        href="/"
        className="absolute left-12 top-12 grid h-12 w-12 place-items-center rounded-full bg-gray-100 duration-150 hover:bg-gray-200"
      >
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="h-[1.2rem] cursor-pointer"
        />
      </Link>
    </div>
  );
}
