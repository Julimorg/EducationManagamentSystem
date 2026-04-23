import { Outlet, Route, Routes } from 'react-router-dom';

import Sidebar from '@/Components/SideBar/SideBar';

import Permission from '@/Page/Permission/Permission';
import Login from '@/Auth/Login';
import Orgs from '@/Page/Org/Org';

const DefaultRouter = () => {
  const LayoutWithNavbar = () => (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<LayoutWithNavbar />}>
        <Route path="/role-permission" element={<Permission />} />
        <Route path="/company-management" element={<Orgs />} />
      </Route>
    </Routes>
  );
};

export default DefaultRouter;
