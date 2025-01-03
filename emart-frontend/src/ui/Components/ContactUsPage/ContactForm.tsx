'use client';

import { Form, Input } from 'antd';

function ContactForm() {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log('Form submitted successfully:', values);
  };
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
      <div className="flex gap-5">
        <div className="flex-1">
          <Form.Item label="First Name*" name="firstname">
            <Input
              id="firstname"
              name="firstname"
              type="text"
              placeholder="Enter Your First Name"
              className="p-[0.5rem] text-[1.2rem] font-medium outline-none"
              required
            />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item label="Last Name*" name="lastname">
            <Input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Enter Your Last Name"
              className="p-[0.5rem] text-[1.2rem] font-medium outline-none"
              required
            />
          </Form.Item>
        </div>
      </div>
      <div className="mt-2 flex gap-5">
        <div className="flex-1">
          <Form.Item label="Email*" name="email">
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="example@example.com"
              className="p-[0.5rem] text-[1.2rem] font-medium outline-none"
              required
            />
          </Form.Item>
        </div>
        <div className="flex-1">
          <Form.Item label="Phone Number*" name="phone">
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="98********"
              className="p-[0.5rem] text-[1.2rem] font-medium outline-none"
              required
            />
          </Form.Item>
        </div>
      </div>
      <div className="relative mt-2">
        <Form.Item label="Message*" name="message">
          <Input.TextArea
            id="message"
            name="message"
            placeholder="Enter Message...."
            rows={5}
            cols={10}
            className="p-[0.5rem] text-[1.2rem] font-medium outline-none"
            required
          />
        </Form.Item>
      </div>
      <Form.Item>
        <button
          type="submit"
          className="shadow-lg mt-2 rounded-[0.5rem] bg-blue-500 px-[2.5rem] py-[0.8rem] text-[1rem] text-[#fff]"
        >
          Submit
        </button>
      </Form.Item>
    </Form>
  );
}
export default ContactForm;
