import React, { useState } from 'react';
import { Table, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import type { Permission, CreatePermission } from '@/Interface/Permission';

import CreatePermissionModal from './PermissionModal';

import { useGetPermission } from '@/Hook/useGetPermission';
import { useCreatePermission } from '../hook/ useCreatePermission';
import { useEditPermission } from '../hook/useEditPermission';
import { toast } from 'react-toastify';
import EditPermissionModal from './EditPermission';

const PermissionTable: React.FC = () => {
  const { data, isLoading, refetch } = useGetPermission();
  const { mutateAsync: createPermission } = useCreatePermission();
  const { mutateAsync: editPermission } = useEditPermission();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  const handleCreatePermission = async (formData: CreatePermission) => {
    try {
      await createPermission(formData);
      toast.success('Tạo quyền thành công!');
      setIsCreateModalOpen(false);
      refetch();
    } catch {
      toast.error('Tạo quyền thất bại!');
    }
  };

  const handleEditPermission = async (formData: {
    permission_name: string;
    description: string;
  }) => {
    if (!selectedPermission) return;
    try {
      await editPermission({ permission_id: selectedPermission.permission_id, body: formData });
      toast.success('Cập nhật quyền thành công!');
      setIsEditModalOpen(false);
      refetch();
    } catch {
      toast.error('Cập nhật quyền thất bại!');
    }
  };

  const columns: ColumnsType<Permission> = [
    {
      title: 'Tên quyền',
      dataIndex: 'permission_name',
      key: 'permission_name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Permission) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedPermission(record);
            setIsEditModalOpen(true);
          }}
        >
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Tạo quyền
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data || []}
        rowKey="permission_id"
        loading={isLoading}
        pagination={false}
        bordered
      />

      <CreatePermissionModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePermission}
      />

      <EditPermissionModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditPermission}
        initialData={
          selectedPermission
            ? {
                permission_name: selectedPermission.permission_name,
                description: selectedPermission.description,
              }
            : undefined
        }
      />
    </div>
  );
};

export default PermissionTable;
