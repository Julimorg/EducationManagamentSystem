import React from 'react'
import { ProfileData } from '../Profile'

type Props = { profile: ProfileData }

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ProfileHero({ profile }: Props) {
  return (
    <div className="relative bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-7 flex items-center gap-5 overflow-hidden rounded-t-xl">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute right-16 -bottom-10 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
        <span className="text-xl font-medium text-white">
          {getInitials(profile.userName)}
        </span>
      </div>

      {/* Info */}
      <div>
        <h1 className="text-xl font-medium text-white leading-tight">
          {profile.userName}
        </h1>
        <p className="text-sm text-slate-300 mt-0.5">{profile.className}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              profile.status === 'Active' ? 'bg-green-400' : 'bg-gray-400'
            }`}
          />
          <span className="text-xs text-white/80 font-medium">
            {profile.status}
          </span>
        </div>
      </div>
    </div>
  )
}