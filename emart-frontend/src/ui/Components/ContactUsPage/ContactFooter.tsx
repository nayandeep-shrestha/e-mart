import Link from 'next/link';

function ContactFooter() {
  return (
    <div className="footer sticky mt-10 border-t py-[1.5rem] text-center">
      © 2024. All rights reserved by{' '}
      <Link
        href="https://www.nipunasewa.com/"
        target="_blank"
        className="text-blue-500"
      >
        Nipuna Prabidhik Sewa{' '}
      </Link>
      v1.3.0
    </div>
  );
}

export default ContactFooter;
