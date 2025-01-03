function ContactMap() {
  return (
    <div className="mb-5">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.206534784533!2d85.32624207550859!3d27.680010776198287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19fbaee5fe7d%3A0x60385a013e72265a!2sNIPUNA%20Prabidhik%20Sewa!5e0!3m2!1sen!2snp!4v1718079237148!5m2!1sen!2snp"
        width="100%"
        height="450"
        style={{ border: '0' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default ContactMap;
