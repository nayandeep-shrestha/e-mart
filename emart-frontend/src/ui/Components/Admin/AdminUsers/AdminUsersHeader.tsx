import { addAdminUser } from '@/service/adminUsers.service';
import { CategoriesHeaderProps } from '@/types';
import { MenuSectionHeader } from '@/ui/Atoms';
import { FormInput } from '@/ui/Molecules';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Drawer, Flex, Form, Input, message, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;
const { Item } = Form;
interface AdminUsersHeaderProps
  extends Pick<CategoriesHeaderProps, 'fetchData' | 'searchText' | 'onSearch'> {
  roles: { id: number; title: string }[];
}

export default function AdminUsersHeader({
  searchText,
  onSearch,
  fetchData,
  roles,
}: AdminUsersHeaderProps) {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  // const [adminData, setAdminData] = useState<AdminUsersType[]>([]);

  const handleDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleFormSubmit = async (values: {
    role: number;
    name: string;
    email: string;
    phone: string;
    confirmPassword: string;
    password: string;
  }) => {
    try {
      await addAdminUser(values);
      fetchData();
      message.success('User details added successfully');
      handleDrawerClose();
    } catch (error) {
      console.error('Error while creating user:', error);
    }
  };
  return (
    <>
      <Flex align="center" justify="space-between">
        <MenuSectionHeader
          fetchData={fetchData}
          placeholder="Name"
          showSelect={false}
          searchText={searchText}
          onSearch={onSearch}
          selectedStore={null}
          onStoreChange={null}
        />
        <Button
          htmlType="button"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={() => setDrawerVisible(true)}
          className="shadow-lg h-fit rounded-[0.5rem] bg-blue-500 px-4 py-3 text-lg text-white"
        >
          Add User
        </Button>
      </Flex>
      <Drawer
        title={<div className="text-2xl">Add User</div>}
        width={500}
        onClose={handleDrawerClose}
        open={drawerVisible}
      >
        <Form layout="vertical" onFinish={handleFormSubmit}>
          <FormInput
            name="name"
            label="Name"
            placeholder="Test User"
            type="text"
            required
          />
          <FormInput
            name="email"
            label="Email*"
            placeholder="exampleUser@gmail.com"
            type="text"
            required
          />
          <FormInput
            name="phone"
            label="Mobile Number*"
            placeholder="9800500001"
            type="text"
            required
          />
          <FormInput
            name="password"
            label="Password*"
            placeholder="Password"
            type="password"
            required
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one digit, and one special character (e.g., @, $, !).',
              },
            ]}
          />
          <Item
            name="confirmPassword"
            label="Confirm Password*"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Passwords that you entered do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Re-type Password"
              className="text-[1.1rem] font-normal"
              required
            />
          </Item>
          <Item name="role" label="Role*">
            <Select className="text-[1.1rem] font-normal">
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.title}
                </Option>
              ))}
            </Select>
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              className="h-fit w-full rounded-full border-none bg-[#0995f7] px-3 py-2 text-[1.1rem] font-normal text-white"
            >
              Update
            </Button>
          </Item>
        </Form>
      </Drawer>
    </>
  );
}
