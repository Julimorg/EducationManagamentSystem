import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import type { EditPermission } from '@/Interface/Permission';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EditPermission) => void;
  initialData?: EditPermission;
}

const EditPermissionModal: React.FC<Props> = ({ open, onClose, onSubmit, initialData }) => {
  const [form] = Form.useForm<EditPermission>();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleFinish = (values: EditPermission) => {
    onSubmit(values);
  };

  return (
    <Modal open={open} title="Chỉnh sửa quyền" onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên quyền"
          name="permission_name"
          rules={[{ required: true, message: 'Vui lòng nhập tên quyền' }]}
        >
          <Input placeholder="Nhập tên quyền" />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả quyền" />
        </Form.Item>

        <Space className="flex justify-end">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default EditPermissionModal;
