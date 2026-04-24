import React, { useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { TopNav } from '../components/TopNav'
import { EditProfileModal } from '../components/EditProfileModal'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import {
  UserIcon,
  MailIcon,
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  TargetIcon,
  ActivityIcon,
  HashIcon,
} from 'lucide-react'
export function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [userData, setUserData] = useState({
    userName: 'Alice Nguyen',
    email: 'alice.nguyen@example.com',
    dob: '2005-08-15',
    address: '123 IELTS Street, District 1, HCMC',
    className: 'IELTS Intensive 01',
    target: '7.0',
    status: 'Active',
    nickName: '',
  })
  const handleSaveProfile = (newData: any) => {
    setUserData((prev) => ({
      ...prev,
      ...newData,
    }))
  }
  const InfoItem = ({ icon: Icon, label, value, isEmpty = false }: any) => (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="p-2 bg-white rounded-md shadow-sm mr-4 text-orange-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p
          className={`mt-1 font-medium ${isEmpty ? 'text-gray-400 italic' : 'text-gray-900'}`}
        >
          {isEmpty ? 'Not set' : value}
        </p>
      </div>
    </div>
  )
  return (
    <div className="flex h-screen w-full bg-[#F5F5F3] font-sans overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header Profile Section */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-12 text-white relative">
                <div className="flex items-center">
                  <div className="w-24 h-24 rounded-full bg-white text-orange-500 flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-lg">
                    {userData.userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="ml-6">
                    <h1 className="text-3xl font-bold">{userData.userName}</h1>
                    <p className="text-orange-100 mt-1">{userData.className}</p>
                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                      {userData.status}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-4 border-b border-gray-100 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Info Grid */}
              <div className="p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={UserIcon}
                    label="User Name"
                    value={userData.userName}
                  />
                  <InfoItem
                    icon={HashIcon}
                    label="Nick Name"
                    value={userData.nickName}
                    isEmpty={!userData.nickName}
                  />
                  <InfoItem
                    icon={MailIcon}
                    label="Email Address"
                    value={userData.email}
                  />
                  <InfoItem
                    icon={CalendarIcon}
                    label="Date of Birth"
                    value={userData.dob}
                  />
                  <InfoItem
                    icon={MapPinIcon}
                    label="Address"
                    value={userData.address}
                  />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-6 mt-10 border-b border-gray-100 pb-2">
                  Academic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={BookOpenIcon}
                    label="Class Name"
                    value={userData.className}
                  />
                  <InfoItem
                    icon={TargetIcon}
                    label="Target Band"
                    value={userData.target}
                  />
                  <InfoItem
                    icon={ActivityIcon}
                    label="Status"
                    value={userData.status}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={{
          userName: userData.userName,
          email: userData.email,
          dob: userData.dob,
          address: userData.address,
          nickName: userData.nickName,
        }}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}
