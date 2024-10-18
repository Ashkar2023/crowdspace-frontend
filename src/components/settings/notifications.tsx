import { ScrollShadow, Switch } from '@nextui-org/react';
import { LuAppWindow, LuBellRing, LuNutOff } from 'react-icons/lu';

const Notifications = () => {
    return (
        <ScrollShadow
            className="w-full px-20 h-full py-10 space-y-6 overflow-y-scroll" id='notification-settings'
            size={50}
        >
            <h2 className="text-lg font-semibold flex">
                <LuBellRing className='self-center mr-1.5' />
                Push Notifications
            </h2>
            
            <div className="space-y-2">
                {["likes", "comments", "follows", "messages", "stories", "posts", "liveStream"].map((item) => (
                    <div key={item} className="flex items-center justify-between bg-gradient-to-r from-gray-200 from-65% to-slate-100 p-2 px-4 rounded-xl">
                        <label htmlFor={`push-${item}`} className="text-sm font-semibold">
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </label>
                        <Switch color="success" id={`push-${item}`} isSelected={true} />
                    </div>
                ))}
            </div>

            <h2 className="text-lg font-semibold flex">
                <LuAppWindow className='self-center mr-1.5' />
                In-App Notifications
            </h2>
            <div className="space-y-2">
                {["likes", "comments", "follows", "messages", "stories", "posts", "liveStream"].map((item) => (
                    <div key={item} className="flex items-center justify-between bg-gradient-to-r from-gray-200 from-65% to-slate-100 p-2 px-4 rounded-xl">
                        <label htmlFor={`inapp-${item}`} className="text-sm font-semibold">
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </label>
                        <Switch color="success" id={`inapp-${item}`}  isSelected={true} />
                    </div>
                ))}
            </div>
        </ScrollShadow>
    );
};

export default Notifications;
