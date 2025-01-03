import { Logo } from '@/ui/Molecules';

function ResetPasswordHeader() {
  return (
    <div className="mb-12 flex flex-col items-center text-center">
      <Logo width={250} height={250} className="mb-6 rounded" />
      <span className="text-xl ">Please, enter new password!</span>
    </div>
  );
}

export default ResetPasswordHeader;
