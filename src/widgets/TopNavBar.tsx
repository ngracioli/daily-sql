import Link from "next/link";
import { Avatar } from "@/shared/ui";

export function TopNavBar() {
  return (
    <header className="bg-surface dark:bg-surface-container-lowest text-primary dark:text-on-surface flex justify-between items-center w-full px-lg h-16 max-w-full top-0 border-b border-[#ebebeb] dark:border-on-surface-variant flex-shrink-0 z-10">
      <div className="flex items-center gap-md text-headline-md font-headline-md font-bold tracking-tighter text-primary dark:text-on-surface">
        <span>DailySQL</span>
      </div>
      <nav className="hidden md:flex items-center h-full space-x-lg">
        <Link
          href="#"
          className="h-full flex items-center text-primary dark:text-on-surface font-bold border-b-2 border-primary dark:border-on-surface pb-1 text-label-sm font-label-sm font-medium"
        >
          Challenges
        </Link>
        <Link
          href="#"
          className="h-full flex items-center text-secondary dark:text-on-secondary-container hover:text-primary dark:hover:text-on-surface transition-colors duration-200 text-label-sm font-label-sm font-medium"
        >
          Leaderboard
        </Link>
      </nav>
      <div className="flex items-center gap-md">
        <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2g1gMHfC70nyMA4DD9qml1zp-9Lf2YAaTbCaXUZf_7ZWoDjPr-qBblbgxO9sps0xKuOqGVb1YoqeEB7J1WhiuxsHvV4BgyL-9KGUB3g-m17PxonDARZhEx9N9oXcSSQMbC_1mrScAKvXwszlYe1502jnmHmKGBXHHAsPOiD-XfBTdtycLWg7OYqQQ1GxIDbOHTgr17FpTuVxYQCpZjxGJiY6EyrA-gH_odlHbkfEZXCq-V6RFIcG_WrPo5PMo03JjoA76NluRIhha" />
      </div>
    </header>
  );
}
