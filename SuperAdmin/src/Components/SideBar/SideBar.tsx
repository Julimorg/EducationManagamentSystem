import {
  ApartmentOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
      isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 h-screen p-4 bg-white shadow-md z-[1000]">
      <div>
        <button onClick={() => navigate('/dashboard')}>
          <h1 className="flex items-center gap-2 mb-6 text-lg font-bold text-blue-900">
            <ApartmentOutlined className="text-2xl" />
            Trang Quản Lý
          </h1>
        </button>
      </div>


      <div className="mt-4">
        <NavLink to="/company-management" className={menuItemClass}>
          <ApartmentOutlined />
          Quản lý công ty
        </NavLink>
      </div>
      <div className="mt-4">
        <NavLink to="/role-permission" className={menuItemClass}>
          <SafetyOutlined />
          Quản lý quyền
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
