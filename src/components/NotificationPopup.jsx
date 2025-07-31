import React from 'react';
import { FiX, FiBell, FiCheck } from 'react-icons/fi';

const NotificationPopup = ({ 
  notifications, 
  unreadCount, 
  isOpen, 
  onClose,
  isLoading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-16 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <FiBell className="text-teal-600" />
          Notifications
          {unreadCount > 0 && (
            <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h3>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            Loading notifications...
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-teal-50' : ''
              }`}
            >
              <div className="flex items-start gap-2">
                {!notification.isRead && (
                  <span className="mt-1 w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.time).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <FiBell className="w-6 h-6 mx-auto mb-2 text-gray-400" />
            <p>No notifications yet</p>
          </div>
        )}
      </div>
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <button 
            onClick={onClose} 
            className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-1 w-full"
          >
            <FiCheck /> Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;