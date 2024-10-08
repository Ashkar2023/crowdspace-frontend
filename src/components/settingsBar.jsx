import { Link, useLocation } from "react-router-dom";
import { LuActivity, LuBan, LuBell, LuLock, LuShield, LuUser } from "react-icons/lu"
import { useEffect } from "react";

const settingsNavItems = [
    { label: "Profile", href: "/settings/profile", icon: LuUser },
    { label: "Privacy", href: "/settings/privacy", icon: LuShield },
    { label: "Notifications", href: "/settings/notifications", icon: LuBell },
    { label: "Security", href: "/settings/security", icon: LuLock },
    { label: "Blocked", href: "/settings/blocked", icon: LuBan },
    { label: "Activity", href: "/settings/activity", icon: LuActivity },
]

export function SettingsNav() {
    const location = useLocation();
    console.log(location);

    return (
        <div className="h-full w-full ">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <nav className="space-y-2 text-sm">
                {settingsNavItems.map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all `
                            + `${location.pathname===item.href? "bg-gray-200":"hover:bg-slate-100"}`
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}