"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/modules/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/modules/ui/sheet";
import { Button } from "@/modules/ui/button";
import UserPhoto from "@/modules/shared/components/UserPhoto";
import Modal from "@/modules/shared/components/Modal";
import ConfirmSignOut from "@/modules/shared/components/ConfirmSignOut";
import { CurrentUserDTO } from "@/modules/shared/dto/User.dto";
import { getUserName } from "@/modules/shared/utils/helper";
import { Menu } from "lucide-react";
import Logo from "@/modules/shared/components/Logo";

export default function NavBar({ user }: { user: CurrentUserDTO }) {
  const isInstructor = user.role === "INSTRUCTOR";
  const isAdmin = user.role === "ADMIN";
  const isStudent = user.role === "STUDENT";
  const { firstName: name } = getUserName(user);

  return (
    <nav className="w-full border-b border-slate-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Brand */}
        <Logo logoUrl="/logo/logo1.png" linkUrl="/dashboard" />

        {/* Desktop (md+) */}
        <div className="hidden lg:flex items-center gap-4">
          <NavigationMenu className="border-none shadow-none">
            <NavigationMenuList className="flex items-start gap-3">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="rounded-none border-none shadow-none bg-transparent text-slate-700 font-medium text-sm hover:bg-transparent active:bg-transparent data-[state=open]:bg-transparent">
                  <UserPhoto photoUrl={user?.photo} />
                  <div className="ml-2">
                    <span className="font-semibold">{name}</span>
                    {user?.instructor ? (
                      <span className="bg-slate-600 ml-1 text-slate-50 px-1">
                        {user.instructor.title}
                      </span>
                    ) : (
                      ""
                    )}
                    {user?.student ? `  ${user.userId}` : ""}

                    {user?.admin ? (
                      <span className="bg-slate-600 ml-1 text-slate-50 px-1">
                        Admin
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </NavigationMenuTrigger>

                <NavigationMenuContent className="!shadow-none !rounded-none bg-white">
                  <ul className="grid gap-2 p-4 w-[180px] rounded-none">
                    <li>
                      <NavigationMenuLink
                        href="/profile"
                        className="block text-sm hover:rounded-none hover:bg-transparent hover:text-yellow-400"
                      >
                        Profile
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Modal>
                        <Modal.Open opens="signout">
                          <button
                            type="button"
                            className="block w-full text-left text-sm hover:rounded-none hover:bg-transparent hover:text-red-400 !cursor-pointer"
                          >
                            Sign out
                          </button>
                        </Modal.Open>
                        <Modal.Window name="signout">
                          <ConfirmSignOut />
                        </Modal.Window>
                      </Modal>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/dashboard"
                  className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                >
                  {isAdmin ? "Dashboard" : "Home"}
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/courses"
                  className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                >
                  All Classes
                </NavigationMenuLink>
              </NavigationMenuItem>
              {isStudent ? (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/payments"
                    className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                  >
                    Payments
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ) : (
                isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      href="/admin/enrollments"
                      className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                    >
                      Enrollments
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/admin/accounts"
                    className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                  >
                    Accounts
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/admin/attendance"
                    className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                  >
                    Attendance
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/admin/access-controll"
                    className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                  >
                    Access Control
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {!isStudent && (
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/payment-history"
                    className="text-sm hover:rounded-none hover:text-yellow-400 hover:bg-transparent"
                  >
                    Payments
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile (<md) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none hover:bg-transparent"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72 sm:w-80">
              {/* ✅ Required for Radix accessibility */}
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              {/* User header */}
              <div className="mt-2 flex items-center gap-3 border-b border-slate-200 pb-3 px-2">
                <UserPhoto photoUrl={user?.photo} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-800">
                    {name}
                  </div>
                  <div className="truncate text-xs text-slate-600">
                    {user?.instructor
                      ? user.instructor.title
                      : user?.student
                        ? user.userId
                        : ""}
                  </div>
                </div>
              </div>

              {/* Links */}
              <ul className="mt-4 grid gap-2 px-2">
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/dashboard"
                      className="block rounded-none px-1 py-2 text-sm text-slate-700 hover:text-yellow-500"
                    >
                      Home
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                    >
                      Profile
                    </Link>
                  </SheetClose>
                </li>
                <li>
                  <SheetClose asChild>
                    <Link
                      href="/courses"
                      className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                    >
                      All Classes
                    </Link>
                  </SheetClose>
                </li>

                {isStudent && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/payments"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Paymentsh
                      </Link>
                    </SheetClose>
                  </li>
                )}
                {isAdmin && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/admin/accounts"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Accounts
                      </Link>
                    </SheetClose>
                  </li>
                )}

                {isAdmin && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/admin/accounts"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Attendance
                      </Link>
                    </SheetClose>
                  </li>
                )}

                {isAdmin && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/admin/access-controll"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Access Controll
                      </Link>
                    </SheetClose>
                  </li>
                )}

                {isAdmin && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/admin/attendance"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Attendance
                      </Link>
                    </SheetClose>
                  </li>
                )}

                {!isStudent && (
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/payment-history"
                        className="block rounded-none px-1 py-2 text-sm text-slate-700 active:text-yellow-500"
                      >
                        Payments
                      </Link>
                    </SheetClose>
                  </li>
                )}

                <li className="pt-2">
                  <Modal>
                    <Modal.Open opens="signout">
                      <button
                        type="button"
                        className="block w-full text-left text-sm text-slate-700 active:text-red-500 !coursor-pointer"
                      >
                        Sign out
                      </button>
                    </Modal.Open>
                    <Modal.Window name="signout">
                      <ConfirmSignOut />
                    </Modal.Window>
                  </Modal>{" "}
                </li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
