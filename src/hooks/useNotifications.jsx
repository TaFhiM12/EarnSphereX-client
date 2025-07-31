import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from './useAxiosSecure';
import { useState } from 'react';

const useNotifications = (userEmail) => {
  const [isOpen, setIsOpen] = useState(false);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { 
    data: notifications = [], 
    isLoading,
    refetch 
  } = useQuery({
    queryKey: ['notifications', userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/notifications/${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
    select: (data) => [...data].sort((a, b) => new Date(b.time) - new Date(a.time)),
  });

  // Mark as read mutation
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/notifications/mark-read/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userEmail]);
    }
  });

  // Mark all as read
  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.isRead) {
        markAsRead(notification._id);
      }
    });
  };

  // Toggle notification popup
  const toggleNotifications = () => {
    if (!isOpen) {
      markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  // Close when clicking outside
  const closeNotifications = () => {
    setIsOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    toggleNotifications,
    closeNotifications,
    refetch
  };
};

export default useNotifications;