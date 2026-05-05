import React, { useState } from 'react'
import { ProfileHero } from './Components/ProfileHero'
import { ChangePasswordModal } from './Components/ChangePassword'
import { EditProfileModal } from './Components/EditProfile'
import { ProfileInfo } from './Components/ProfileInfo'

export type ProfileData = {
  userName:    string
  nickName:    string
  email:       string
  dob:         string
  address:     string
  schoolName:  string
  className:   string
  session:     string
  targetBand:  string
  status:      'Active' | 'Inactive'
}

const INITIAL_PROFILE: ProfileData = {
  userName:   'Alice Nguyen',
  nickName:   '',
  email:      'alice.nguyen@example.com',
  dob:        '2005-08-15',
  address:    '123 IELTS Street, District 1, HCMC',
  schoolName: 'IELTS EduSystem',
  className:  'IELTS Intensive 01',
  session:    '2, 4, 6 → 5h – 7h',
  targetBand: '7.0',
  status:     'Active',
}

export function ProfilePage() {
  const [profile, setProfile]       = useState<ProfileData>(INITIAL_PROFILE)
  const [editOpen, setEditOpen]     = useState(false)
  const [pwdOpen, setPwdOpen]       = useState(false)

  function handleSaveProfile(updated: Partial<ProfileData>) {
    setProfile((prev) => ({ ...prev, ...updated }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-0">

      {/* Hero banner */}
      <ProfileHero profile={profile} />

      {/* Actions bar */}
      <div className="bg-white border-b border-gray-100 flex justify-end gap-2 px-6 py-2.5">
        <button
          onClick={() => setPwdOpen(true)}
          className="px-3.5 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 bg-white hover:bg-gray-50 transition-colors"
        >
          Change Password
        </button>
        <button
          onClick={() => setEditOpen(true)}
          className="px-3.5 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      {/* Info sections */}
      <ProfileInfo profile={profile} />

      {/* Modals */}
      <EditProfileModal
        open={editOpen}
        profile={profile}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveProfile}
      />
      <ChangePasswordModal
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
      />
    </div>
  )
}