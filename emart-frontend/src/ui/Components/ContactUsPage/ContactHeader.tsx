import { Logo } from '@/ui/Molecules';

function ContactHeader() {
  return (
    <>
      <div className="mb-2 mt-5 flex w-full flex-col items-center text-center">
        <Logo width={250} height={250} className="mb-6 rounded" />
      </div>
      <h2 className="mb-5 text-center text-[50px]">Introducing our Emart</h2>
      <p className="mb-5 items-center text-justify text-gray-500">
        The ultimate solution for streamlining your order management process.
        Simplify your business operations with a user-friendly interface
        designed exclusively for swiftly capturing and processing small orders.
        Say goodbye to complexity and welcome efficiency as you effortlessly
        record customer requests, track inventory, and manage transactions, all
        in one place. Elevate your customer service and enhance your
        productivity with our focused, single-feature app, making small order
        taking a breeze. Experience the future of seamless order management –
        download the E-Mart today.
      </p>
    </>
  );
}
export default ContactHeader;
