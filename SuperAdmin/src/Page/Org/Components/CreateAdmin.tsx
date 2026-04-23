import React from 'react';
import { Modal, Form, Input, Button, Select, Checkbox, Space } from 'antd';

export type CreateAdmin = {
  user_name: string;
  full_name: string;
  email: string;
  org_id: string;
  is_Active: boolean;
  phone_num: string;
  password: string;
  role: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAdmin) => void;
  orgId: string;
};

const AdminCreateModal: React.FC<Props> = ({ open, onClose, onSubmit, orgId }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: CreateAdmin) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title="Thêm Admin"
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ is_Active: true, role: 'admin', org_id: orgId }}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="user_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
        >
          <Input placeholder="Nhập tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone_num"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="org_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'SuperAdmin', value: 'superadmin' },
            ]}
          />
        </Form.Item>

        <Form.Item name="is_Active" valuePropName="checked">
          <Checkbox>Đang hoạt động</Checkbox>
        </Form.Item>

        <Space className="flex justify-end">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Tạo Admin
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default AdminCreateModal;
