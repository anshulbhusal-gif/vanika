import React, { useState, useEffect } from 'react';
import { Bell, Check, ArrowRight, X, Trash2 } from 'lucide-react';
import { ActiveView, AppNotification } from '../../types';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { apiClient } from '../../services/api/apiClient';

interface NotificationCenterProps {
  onNavigate: (view: ActiveView) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNavigate,
  onClose,
  isModal = false,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.get<any[]>('/notifications');
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AppNotification[] = data.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            read: n.isRead ?? n.read ?? false,
            type: (n.type || 'info').toLowerCase(),
            icon: n.icon || '🔔',
            actionUrl: n.actionUrl || n.link,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        // Fall back to mock data
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    try {
      await apiClient.patch(`/notifications/${id}/read`, {});
    } catch (err) {
      // Best-effort optimistic UI
    }
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await apiClient.patch('/notifications/read-all', {});
    } catch (err) {
      // Best-effort optimistic UI
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C06A44] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">Notifications</h2>
            <p className="font-mono-label text-[10px] text-[#7B9E87]">{unreadCount} UNREAD MESSAGES</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-[#7B9E87] hover:text-[#1A2F24] dark:hover:text-[#F2EDE3] cursor-pointer"
            >
              Mark all read
            </button>
          )}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F5EEE2] dark:bg-[#1A3328] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4 text-[#5A7265]" />
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`card-story p-5 border transition-all flex items-start gap-4 ${
              notification.read
                ? 'bg-white dark:bg-[#162A1F] border-[#2D4739]/10 dark:border-[#D4AF37]/15 opacity-75'
                : 'bg-[#FDFBF7] dark:bg-[#0F2219] border-[#D4AF37]/30 shadow-md'
            }`}
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center text-xl shrink-0">
              {notification.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base font-bold text-[#1A2F24] dark:text-[#F2EDE3]">
                {notification.title}
              </h3>
              <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-1 leading-relaxed">
                {notification.message}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="font-mono-label text-[10px] text-[#7B9E87]">{notification.timestamp}</span>
                {notification.actionView && (
                  <button
                    onClick={() => {
                      markAsRead(notification.id);
                      onNavigate(notification.actionView!);
                      onClose?.();
                    }}
                    className="flex items-center gap-1 font-mono-label text-[10px] text-[#C06A44] dark:text-[#D4AF37] font-bold cursor-pointer"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 shrink-0">
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1 text-[#7B9E87] hover:text-[#1A2F24] cursor-pointer"
                  aria-label="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => deleteNotification(notification.id)}
                className="p-1 text-[#5A7265] hover:text-[#C06A44] cursor-pointer"
                aria-label="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="card-story bg-white dark:bg-[#162A1F] p-10 text-center border border-[#2D4739]/15">
            <span className="text-4xl block mb-3">🔔</span>
            <h3 className="font-display text-xl font-bold text-[#1A2F24] dark:text-[#F2EDE3]">All caught up!</h3>
            <p className="text-xs text-[#5A7265] dark:text-[#9DBFB0] mt-1">No notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/60 backdrop-blur-xs animate-slide-up" onClick={onClose}>
        <div
          className="w-full max-w-md mt-16 card-story bg-white dark:bg-[#162A1F] p-6 shadow-2xl border border-[#D4AF37]/30 max-h-[75vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#0C1A11] py-8 sm:py-12" id="view-notifications">
      <div className="section-max max-w-2xl mx-auto">
        {content}
      </div>
    </div>
  );
};
