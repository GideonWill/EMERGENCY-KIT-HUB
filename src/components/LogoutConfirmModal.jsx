import React from 'react'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
          </div>
          
          <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">Sign out</h3>
          <p className="mt-2 text-sm text-slate-600">
            Are you sure you want to sign out of your account? You will need to sign in again to access your orders and care services.
          </p>
        </div>
        
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            onClick={onCancel}
          >
            NO, stay
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 active:scale-[0.98]"
            onClick={onConfirm}
          >
            YES, sign out
          </button>
        </div>
      </div>
    </div>
  )
}
