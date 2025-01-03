import { VerifyOTPForm } from '@/ui/Components';
import { Logo } from '@/ui/Molecules';

export default function Verify() {
  return (
    <div className="relative flex h-[100vh] flex-col items-center justify-center px-[2rem]">
      <div className="mb-12 flex flex-col items-center text-center">
        <Logo width={250} height={250} className="mb-6 rounded" />
        <div className="w-full text-center">
          <h2 className="mb-3 text-3xl">Verify OTP !!</h2>
          <span className="text-md text-gray-500">Please provide the OTP.</span>
        </div>
      </div>
      <VerifyOTPForm />
    </div>
  );
}
