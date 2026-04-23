import { useState } from 'react';
import { Form, Input, Checkbox, Button, Modal, Table, Typography, Space } from 'antd';
import { docApi } from '@/API/docApi';
import { toast } from 'react-toastify';
import { useGetOrg } from '../hook/useGetOrg';
import { useCreateAdmin } from '../hook/useCreateAdmin';
import AdminCreateModal from './CreateAdmin';
import { Popconfirm } from 'antd';
import { useDeleteOrg } from '../hook/useDeleteOrg';

const { Title } = Typography;

const OrgTable = () => {
  const { data, isLoading, isError, refetch } = useGetOrg();
  const [form] = Form.useForm();
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const { mutate: createAdmin } = useCreateAdmin();

  const orgs = data ?? [];
  const { mutate: deleteOrg } = useDeleteOrg();

  const handleDeleteOrg = (id: string) => {
    // chỉ cho xóa các org không có admin
    deleteOrg(id, {
      onSuccess: (res) => {
        toast.success(res.msg || 'Xóa tổ chức thành công!');
        refetch();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.detail || 'Xóa tổ chức thất bại!');
      },
    });
  };

  const handleAddOrg = () => {
    form.resetFields();
    setIsOrgModalOpen(true);
  };

  const handleCreateAdmin = (orgId: string) => {
    setSelectedOrgId(orgId);
    setIsAdminModalOpen(true);
  };

  const handleAdminSubmit = (values: any) => {
    createAdmin(values, {
      onSuccess: () => {
        toast.success('Tạo admin thành công!');
        setIsAdminModalOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.detail || 'Tạo admin thất bại!');
      },
    });
  };

  const handleOrgSubmit = async (values: {
    org_name: string;
    description: string;
    is_Active: boolean;
  }) => {
    try {
      const isDuplicateOrg = orgs.some(
        (org) => org.org_name.toLowerCase().trim() === values.org_name.toLowerCase().trim()
      );

      if (isDuplicateOrg) {
        toast.error('Tên tổ chức đã tồn tại!');
        return;
      }

      const payload = {
        ...values,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      await docApi.CreateOrg(payload);

      toast.success('Tạo tổ chức thành công!');
      setIsOrgModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Tạo tổ chức thất bại!');
    }
  };

  const columns = [
    {
      title: 'Tên tổ chức',
      dataIndex: 'org_name',
      key: 'org_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_Active',
      key: 'is_Active',
      render: (is_Active: boolean) => (
        <span style={{ color: is_Active ? 'green' : 'red' }}>
          {is_Active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="primary" onClick={() => handleCreateAdmin(record.Id)}>
            Tạo Admin
          </Button>
          <Popconfirm
            title="Xác nhận xoá tổ chức?"
            okText="Xoá"
            cancelText="Hủy"
            onConfirm={() => handleDeleteOrg(record.Id)}
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <p>Đang tải danh sách tổ chức...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải tổ chức</p>;

  return (
    <div>
      <Title level={4}>Danh sách tổ chức</Title>

      <Button type="primary" onClick={handleAddOrg} className="mb-4">
        Thêm tổ chức
      </Button>

      <Table
        columns={columns}
        dataSource={orgs}
        rowKey="Id"
        pagination={{ pageSize: 10 }}
        bordered
        locale={{ emptyText: 'Không có dữ liệu tổ chức' }}
      />

      <Modal
        open={isOrgModalOpen}
        title="Thêm tổ chức mới"
        onCancel={() => setIsOrgModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOrgSubmit}
          initialValues={{ is_Active: true }}
        >
          <Form.Item
            label="Tên tổ chức"
            name="org_name"
            rules={[
              { required: true, message: 'Vui lòng nhập tên tổ chức' },
              { min: 3, message: 'Tên tổ chức ít nhất 3 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên tổ chức" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: 'Vui lòng nhập mô tả' },
              { min: 5, message: 'Mô tả ít nhất 5 ký tự' },
            ]}
          >
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>

          <Form.Item name="is_Active" valuePropName="checked">
            <Checkbox>Đang hoạt động</Checkbox>
          </Form.Item>

          <Space className="flex justify-end">
            <Button onClick={() => setIsOrgModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </Form>
      </Modal>

      <AdminCreateModal
        open={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSubmit={handleAdminSubmit}
        orgId={selectedOrgId ?? ''}
      />
    </div>
  );
};

export default OrgTable;
