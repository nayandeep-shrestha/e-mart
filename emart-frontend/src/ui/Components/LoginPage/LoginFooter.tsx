import Link from 'next/link';

function LoginFooter() {
  return (
    <>
      <div className="mb-[1rem] mt-[2rem] flex w-full items-center justify-center space-x-4 divide-x-2">
        <Link className="text-[1rem] text-blue-500" href="/contact-us">
          Contact Us
        </Link>
        <Link className="pl-4 text-[1rem] text-blue-500" href="/privacypolicy">
          Privacy Policy
        </Link>
      </div>
      <div className="mb-[2rem] flex w-full items-center justify-center space-x-4">
        <Link className="text-[1rem] text-blue-500" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
    </>
  );
}

export default LoginFooter;
