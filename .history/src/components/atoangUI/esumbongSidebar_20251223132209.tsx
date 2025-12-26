"use client"
import Link from "next/link";
interface NavBarProps {
  setActivePage: (activePage: string) => void;
  activePage?: string;
  sidebarPages: any;
}
export default function EsumbongNavBar({
  setActivePage,
  activePage,
  sidebarPages,
}: NavBarProps) {
 
  return (
    <div className="w-72 bg-white border-r shadow-md shrink-0 p-4">
      <nav className="py-6">
        <ul className="space-y-2">
          {sidebarPages.map((page: any) => {
            const Icon = page.icon;
            return (
              <li key={page.id}>
                <Link
                  onClick={() => setActivePage(page.id)}
                  className={`w-full cursor-pointer text-left 
                      px-8 py-3 text-lg hover:bg-blue-50 
                      rounded flex items-center space-x-3 ${
                        activePage === page.id
                          ? "bg-blue-100 font-semibold"
                          : ""
                      }`}
                  href={page.id}
                >
                  <Icon className="w-6 h-6" />
                  <span>{page.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
