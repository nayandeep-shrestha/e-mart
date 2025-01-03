import { Button, Flex } from 'antd';

export default function LogoChange({
  fileRef,
  handleFileChange,
  handleButtonClick,
}: {
  fileRef: React.RefObject<HTMLInputElement>;
  handleFileChange: React.ChangeEventHandler<HTMLInputElement>;
  handleButtonClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Flex className="mt-16" vertical>
      <p className="text-2xl font-bold">Change Brand Logo</p>
      <Flex vertical gap={10} className="mt-5">
        <Button
          className="shadow-lg h-fit w-fit rounded-[0.5rem] bg-blue-500 px-4 py-2 text-lg text-white"
          onClick={handleButtonClick}
        >
          Change Brand Logo
        </Button>
        <input
          ref={fileRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <p className="text-md font-normal text-slate-500">
          Recommended Size: 512x512 px
        </p>
      </Flex>
    </Flex>
  );
}
