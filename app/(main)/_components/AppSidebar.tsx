"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Logo from "@/assets/images/Recruitron.png";
import LogoDark from "@/assets/images/Recruitron_Dark.png";
import { Button } from "@/components/ui/button";
import { BsPlus } from "react-icons/bs";
import { SideBarOptions } from "@/services/Constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme-toggler";

export function AppSidebar() {
  const { theme } = useTheme();
  const path = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center">
        <Image
          src={theme === "dark" ? LogoDark : Logo}
          alt="Recruitron"
          className="w-[200px] h-[150px]"
        />
        <Link href="/dashboard/create-interview" className="w-full">
          <Button className="w-full cursor-pointer">
            <BsPlus /> Create New Interview
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu className="flex flex-col justify-center">
              {SideBarOptions.map((option) => (
                <SidebarMenuItem className="p-1" key={option.name}>
                  <Link
                    className={`flex items-center p-4 gap-3 hover:bg-muted ${
                      path === option.path && "bg-blue-600"
                    } rounded-md`}
                    href={option.path}
                  >
                    <option.icon />
                    {option.name}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarContent>
          <SidebarMenu className="w-full cursor-pointer">
            <SidebarMenuItem className="p-1 mt-auto">
              <ModeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  );
}
