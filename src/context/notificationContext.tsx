import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { INotification } from '~types/dto/notification.dto';

interface NotificationsContextProps {
    notifications: INotification[];
    setNotifications: Dispatch<SetStateAction<INotification[]>>;
    notificationsCount: number;
    setNotificationsCount: Dispatch<SetStateAction<number>>;
}

export const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};