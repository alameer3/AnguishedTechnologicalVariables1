import React, { useState, useRef, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
// استخدام أيقونات SVG مباشرة
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const QuestionMarkCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightOnRectangleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      icon: UserIcon,
      label: 'إدارة الملف الشخصي',
      action: () => router.push('/profile'),
    },
    {
      icon: HeartIcon,
      label: 'قائمتي',
      action: () => router.push('/favourite'),
    },
    {
      icon: CogIcon,
      label: 'الإعدادات',
      action: () => router.push('/settings'),
    },
    {
      icon: QuestionMarkCircleIcon,
      label: 'المساعدة',
      action: () => router.push('/help'),
    },
    {
      icon: ArrowRightOnRectangleIcon,
      label: 'تسجيل الخروج',
      action: () => signOut(),
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer group">
        {session?.user?.image ? (
          <div className="relative w-8 h-8 transition-transform group-hover:scale-105">
            <Image
              src={session.user.image}
              alt={session.user.name || "User profile"}
              fill
              className="object-cover rounded"
              sizes="32px"
            />
          </div>
        ) : (
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white text-sm font-bold">👤</span>
          </div>
        )}
      </div>

      <div className={`profile-dropdown ${isOpen ? 'show' : ''}`}>
        <div className="py-2">
          {session?.user && (
            <div className="px-4 py-3 border-b border-gray-700">
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-gray-400">{session.user.email}</p>
            </div>
          )}
          
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="profile-dropdown-item flex items-center gap-3"
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;