import { Suspense } from 'react';
import { ResetPasswordForm, ResetPasswordHeader } from '@/ui/Components';

export default function ResetPasswordPage() {
  return (
    <main className="relative mx-auto flex h-[100vh] w-[500px] max-w-full flex-col items-center justify-center px-[2rem]">
      <Suspense fallback={<div>Loading header...</div>}>
        <ResetPasswordHeader />
      </Suspense>
      <Suspense fallback={<div>Loading form...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
