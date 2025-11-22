"use client"
import { useUser } from "@clerk/nextjs";
import { useState } from "react"
import { Menu, Home, Settings, Users, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs";


export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="  sticky  top-0">
      {/* Mobile Trigger */}
      <div className="md:hidden p-4 ">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent close={() => setOpen(false)} collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r h-screen bg-background transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Collapse Button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        <SidebarContent collapsed={collapsed} />
      </div>
    </div>
  )
}

function SidebarContent({
  close,
  collapsed,
}: {
  close?: () => void
  collapsed: boolean
}) {
  const items = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/" },
    { label: "Users", icon: Users, href: "/users" },
    { label: "Home", icon: Home, href: "/home" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ]
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-4 flex flex-col justify-between h-full">
      <div>
        {/* App Name */}
        {!collapsed && (
          <>
            <h2 className="text-xl font-bold mb-4">My App</h2>
            <Separator className="mb-4" />
          </>
        )}

        {/* Nav Items */}
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              onClick={close}
              className={`flex items-center gap-3 p-2 hover:bg-accent rounded-md transition text-sm
                ${collapsed ? "justify-center" : ""}`}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer user */}
<div
  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition cursor-pointer
  ${collapsed ? "justify-center" : ""}`}
>
  {/* Avatar */}
  <UserButton></UserButton>

  {/* Only show text when expanded */}
  {!collapsed && (
    <div className="text-sm leading-tight flex flex-col">
        <span className="font-bold">{user?.fullName}</span>
        <span className="text-sm text-gray-500">{user?.emailAddresses[0].emailAddress}</span>
    </div>
  )}
</div>
    </div>
  )
}
