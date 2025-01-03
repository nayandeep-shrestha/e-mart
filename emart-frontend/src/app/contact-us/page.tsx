import {
  ContactFooter,
  ContactForm,
  ContactHeader,
  ContactMap,
} from '@/ui/Components';

export default function ContactUs() {
  return (
    <main className="w-xs-full relative m-auto w-[55%] max-w-full px-[2.5rem]">
      <ContactHeader />
      <ContactMap />
      <h2 className="mb-8 mt-[5rem] text-center text-[40px]">Contact Us</h2>
      <ContactForm />
      <ContactFooter />
    </main>
  );
}
