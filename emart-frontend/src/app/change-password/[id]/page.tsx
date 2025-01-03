import { ChangePasswordForm, ChangePasswordHeader } from '@/ui/Components';

export default function ChangePassword() {
  return (
    <main className="relative mx-auto flex h-[100vh] w-[500px] max-w-full flex-col items-center justify-center px-[2rem]">
      <ChangePasswordHeader />
      <ChangePasswordForm />
    </main>
  );
}
