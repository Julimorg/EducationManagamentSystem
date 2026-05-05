import React from 'react'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Activity,
  School,
  Users,
  Clock,
  TrendingUp,
  Tag,
} from 'lucide-react'
import { ProfileData } from '../Profile'

type Props = { profile: ProfileData }

type InfoItem = {
  icon:  React.ReactNode
  label: string
  value: string
  accent?: string
}

export function ProfileInfo({ profile }: Props) {
  const personal: InfoItem[] = [
    {
      icon:  <User className="w-3.5 h-3.5" />,
      label: 'User name',
      value: profile.userName,
    },
    {
      icon:  <Tag className="w-3.5 h-3.5" />,
      label: 'Nick name',
      value: profile.nickName || 'Not set',
    },
    {
      icon:  <Mail className="w-3.5 h-3.5" />,
      label: 'Email address',
      value: profile.email,
    },
    {
      icon:  <Calendar className="w-3.5 h-3.5" />,
      label: 'Date of birth',
      value: profile.dob,
    },
    {
      icon:  <MapPin className="w-3.5 h-3.5" />,
      label: 'Address',
      value: profile.address,
    },
    {
      icon:   <Activity className="w-3.5 h-3.5" />,
      label:  'Status',
      value:  profile.status,
      accent: profile.status === 'Active' ? 'text-green-600' : 'text-gray-400',
    },
  ]

  const academic: InfoItem[] = [
    {
      icon:  <School className="w-3.5 h-3.5" />,
      label: 'School',
      value: profile.schoolName,
    },
    {
      icon:  <Users className="w-3.5 h-3.5" />,
      label: 'Class name',
      value: profile.className,
    },
    {
      icon:  <Clock className="w-3.5 h-3.5" />,
      label: 'Session',
      value: profile.session,
    },
    {
      icon:   <TrendingUp className="w-3.5 h-3.5" />,
      label:  'Target band',
      value:  profile.targetBand,
      accent: 'text-slate-700 font-semibold',
    },
  ]

  return (
    <div className="bg-white rounded-b-xl border border-t-0 border-gray-100 divide-y divide-gray-100">
      <Section label="Personal information" items={personal} />
      <Section label="Academic information" items={academic} />
    </div>
  )
}

function Section({ label, items }: { label: string; items: InfoItem[] }) {
  return (
    <div className="px-6 py-5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <InfoCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  )
}

function InfoCard({ item }: { item: InfoItem }) {
  const isMuted = !item.value || item.value === 'Not set'

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="w-7 h-7 rounded-md bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-400 shadow-sm">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 mb-0.5">{item.label}</p>
        <p
          className={`text-sm truncate ${
            item.accent
              ? item.accent
              : isMuted
              ? 'text-gray-400 italic'
              : 'text-gray-800 font-medium'
          }`}
        >
          {item.value}
        </p>
      </div>
    </div>
  )
}