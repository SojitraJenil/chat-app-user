// components/bottombar/BottomBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";

const BottomBar = () => {
    const router = useRouter();

    const navItems = [
        { label: "Chat", href: "/users", icon: "💬" },
        { label: "Find User", href: "/find-user", icon: "🔍" },
        { label: "Notifications", href: "/notifications", icon: "🔔" },
        { label: "Settings", href: "/settings", icon: "⚙️" },
        { label: "Profile", href: "/profile", icon: "👤" },
    ];

    return (
        <div className="aside-header sticky bottom-0 right-0 left-0 z-40 text-gray-400 border border-t-black-400">
            <div className="flex justify-around items-center px-2 py-1 ">
                {navItems.map((item) => (
                    <Link key={item.label} href={item.href} passHref>
                        <div
                            className={`flex flex-col px-2 items-center justify-center cursor-pointer transform transition-all duration-300 ${router.pathname === item.href
                                ? " bg-red-500 text-white scale-105"
                                : "text-gray-500 hover:text-red"
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-sm">{item.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BottomBar;
