/**
 * v0 by Vercel.
 * @see https://v0.app/t/5orV8nhk5Ac
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function  NotificationComponent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button  className="bg-transparent">
          <BellIcon className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-[400px] overflow-auto">
        <div className="grid gap-4 p-4">
          <h4 className="font-medium leading-none">Notifications</h4>
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-blue-500" />
            <div className="grid gap-1">
              <p className="text-sm font-medium">New Concern received</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">5 min ago</p>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-blue-500" />
            <div className="grid gap-1">
              <p className="text-sm font-medium">Summons has been processed</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">10 min ago</p>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <span className="flex h-2 w-2 translate-y-1.5 rounded-full bg-blue-500" />
            <div className="grid gap-1">
              <p className="text-sm font-medium">New Concern received</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            Mark All as Read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
  )
}