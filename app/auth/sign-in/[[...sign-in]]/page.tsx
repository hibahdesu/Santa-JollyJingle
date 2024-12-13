import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="bg-tertiary font-sans min-h-screen flex items-center justify-center p-24">
      <div className="w-full flex items-center justify-center">
        <SignIn />
      </div>
    </div>
  );
}
