import { useState, Dispatch, SetStateAction, ReactNode, FC } from 'react';
import { INotification } from '~types/dto/notification.dto';
import { NotificationsContext } from './notificationContext';

export const NotificationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [notificationsCount, setNotificationsCount] = useState<number>(0);


    return (
        <NotificationsContext.Provider value={{ notifications, setNotifications, notificationsCount, setNotificationsCount }}>
            {children}
        </NotificationsContext.Provider>
    );
};

