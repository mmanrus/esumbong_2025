/**
 * v0 by Vercel.
 * @see https://v0.app/t/5orV8nhk5Ac
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/useNotifications";
import Link from "next/link";
export default function NotificationComponent({
  userId,
  type,
}: {
  userId?: string;
  type?: string;
}) {
  const notifications = useNotification(userId);

  const roleBasePath =
    type === "barangay_official"
      ? "officials"
      : type === "resident"
      ? "resident"
      : "admin";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent">
          <BellIcon className="h-4 w-4 mr-2" />
          Notifications
          {notifications.length > 0 && (
            <span className="ml-2 text-xs bg-red-500 text-white px-2 rounded-full">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[400px] overflow-auto">
        <div className="grid gap-4 p-4">
          {notifications.map((n) => (
            <div key={n.id} className="grid grid-cols-[25px_1fr] gap-2">
              <span className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">{n.message}</p>
                {n.type && (
                  <Link
                    href={
                      n.url
                    }
                    className="text-xs text-blue-600"
                  >
                    View {n.type}
                  </Link>
                )}
              </div>
            </div>
          ))}
          <Button variant="outline" className="mt-4">
            Mark All as Read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BellIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
