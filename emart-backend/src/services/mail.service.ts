import nodemailer from 'nodemailer';

const sendEmail = async (options: nodemailer.SendMailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "testing.backend07@gmail.com",
                pass: "lhiwjlessphkziwy",
            },
        });

        const mail = await transporter.sendMail(options);

        return mail;
    } catch (error) {
        console.error('Mail error: ', error);
        return null;
    }
};

export default sendEmail;
