"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ListCheck, LogOut, Menu, X, CaravanIcon, User2, Fuel, ListChecks, AlignJustify, FileSpreadsheet, UserRoundCog, LucideSquareArrowOutUpRight, KeyRound, LayoutDashboard, Download, ArrowLeftRight, List, Bell, FileUp, FileDown, AudioWaveform } from 'lucide-react'
import { logout } from '@/lib/auth'
import { useEffect, useState } from 'react'
import ThemeChanger from '../ThemeChanger'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from '@/types/auth'
import OnlyAllowed from '../OnlyAllowed'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User>()

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('adminUser')!))

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '[') {
        toggleSidebar()
      }
    }

    const handleBackEvent = () => {
      if (isOpen) {
        setIsOpen(false)
        history.pushState(null, '', window.location.href);
      }
    }

    const isMobile = window.innerWidth <= 768;

    window.addEventListener("keydown", handleKeyDown);
    if (isMobile) {
      window.addEventListener("popstate", handleBackEvent);

      if (isOpen) {
        history.pushState(null, "", window.location.href);
      }
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (isMobile) {
        window.removeEventListener("popstate", handleBackEvent);
      }
    };
  }, [isOpen])

  const handleLogout = () => {
    logout()
  }

  const toggleSidebar = () => {
    setIsOpen(prev => {
      if (!prev) {
        history.pushState(null, '', window.location.href);
      }
      return !prev;
    });
  }

  // add event listener for window.back and set the isopen false if it is tue 

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger id="menuIcon" className="top-4 left-4 z-30 sticky">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </SheetTrigger>
        <SheetContent
          side="left"
          className="top-0 left-0 z-50 fixed bg-background shadow w-max h-full"
        >
          <SheetHeader>
            <SheetTitle>Hii {user?.name}</SheetTitle>
          </SheetHeader>
          <SheetDescription>
            Your role{user?.roles?.length! > 1 ? "s are: " : " is: "}
            {user?.roles.join(", ")}
          </SheetDescription>
          <div className="flex flex-col p-3 h-full">
            <nav className="h-[80%] overflow-y-auto relative">
              <ul className="space-y-1 text-sm">
                <OnlyAllowed
                  allowedRoles={["Admin", "Diesel Control Center Staff"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/dashboard">
                      <Button variant="ghost" className="justify-start w-full">
                        <LucideSquareArrowOutUpRight className="mr-2 w-4 h-4" />
                        Allocate
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Trans App"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/trans-app/unloading-tracker">
                      <Button variant="ghost" className="justify-start w-full">
                        <FileDown className="mr-2 w-4 h-4" />
                        Unloading Tracker
                      </Button>
                    </Link>
                  </li>
                  <li onClick={toggleSidebar}>
                    <Link href="/trans-app/loading-planner">
                      <Button variant="ghost" className="justify-start w-full">
                        <FileUp className="mr-2 w-4 h-4" />
                        Loading Planner
                      </Button>
                    </Link>
                  </li>
                  <li onClick={toggleSidebar}>
                    <Link href="/trans-app/loading-tracker">
                      <Button variant="ghost" className="justify-start w-full">
                        <AudioWaveform className="mr-2 w-4 h-4" />
                        Loading Tracker
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Diesel Control Center Staff", "Admin"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/manage-vehicles">
                      <Button variant="ghost" className="justify-start w-full">
                        <CaravanIcon className="mr-2 w-4 h-4" />
                        Manage Vehicles
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Diesel Control Center Staff", "Admin", "BCC Authorized Officer"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/push-notifications">
                      <Button variant="ghost" className="justify-start w-full">
                        <Bell className="mr-2 w-4 h-4" />
                        Notification
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Admin", "Diesel Control Center Staff"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/fuel-request">
                      <Button variant="ghost" className="justify-start w-full">
                        <Fuel className="mr-2 w-4 h-4" />
                        Fuel Requests
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Admin", "Diesel Control Center Staff"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/manage-requests">
                      <Button variant="ghost" className="justify-start w-full">
                        <ArrowLeftRight className="mr-2 w-4 h-4" />
                        Manage Requests
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                {/* Dynamica access Routes starts here ................ */}
                <OnlyAllowed
                  allowedRoles={["Admin", "Diesel Control Center Staff"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href={`/my-allocation?allocator=${user?.userId}`}>
                      <Button variant="ghost" className="justify-start w-full">
                        <List className="mr-2 w-4 h-4" />
                        My Allocations
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Admin"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href='fuel-allocations'>
                      <Button variant="ghost" className="justify-start w-full">
                        <LayoutDashboard className="mr-2 w-4 h-4" />
                        Fuel Allocations
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={["Admin"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href='fuel-requests'>
                      <Button variant="ghost" className="justify-start w-full">
                        <LayoutDashboard className="mr-2 w-4 h-4" />
                        Fuel Reqursts
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={[
                    "Admin",
                    "Diesel Control Center Staff",
                    "Data Entry",
                    "BCC Authorized Officer",
                    "Diesel Average",
                  ]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/dispense-records">
                      <Button variant="ghost" className="justify-start w-full">
                        <ListChecks className="mr-2 w-4 h-4" />
                        Dispense Records
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={[
                    "Admin",
                    "Loading Incharge",
                    "BCC Authorized Officer",
                  ]}
                >
                  <li onClick={toggleSidebar}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href="/loading/orders">
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                            >
                              <AlignJustify className="mr-2 w-4 h-4" />
                              Loading Orders
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background max-w-44 text-foreground text-md">
                          <p>
                            Orders for loading a Bowser, to make it ready for a
                            trip
                            <br />
                            (For Loading Incharges and for BCC to create and
                            manage the orders)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={[
                    "Admin",
                    "Petrol Pump Personnel",
                    "BCC Authorized Officer",
                  ]}
                >
                  <li onClick={toggleSidebar}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href="/loading/petrol-pump">
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                            >
                              <Fuel className="mr-2 w-4 h-4" />
                              Orders
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background max-w-44 text-foreground text-md">
                          <p>
                            Orders for loading a Bowser, to make it ready for a
                            trip
                            <br />
                            (For Petrol Pumps)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed allowedRoles={["Admin", "BCC Authorized Officer"]}>
                  <li onClick={toggleSidebar}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href="/loading/sheet">
                            <Button
                              variant="ghost"
                              className="justify-start w-full"
                            >
                              <FileSpreadsheet className="mr-2 w-4 h-4" />
                              Loading Sheets
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent className="bg-background max-w-44 text-foreground text-md">
                          <p>
                            After the order is fulfilled, the details will show
                            here to assign bowser driver and destination
                            <br />
                            (For Bowser Control Center Only)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={[
                    "Admin",
                    "BCC Authorized Officer",
                    "Diesel Control Center Staff",
                    "Data Entry",
                  ]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/tripsheets">
                      <Button variant="ghost" className="justify-start w-full">
                        <ListCheck className="mr-2 w-4 h-4" />
                        Trip Sheets
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed
                  allowedRoles={[
                    "Admin",
                    "BCC Authorized Officer",
                    "Calibration Staff",
                  ]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/manage-bowsers">
                      <Button variant="ghost" className="justify-start w-full">
                        <CaravanIcon className="mr-2 w-4 h-4" />
                        Manage Bowsers
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <OnlyAllowed allowedRoles={["Admin", "BCC Authorized Officer"]}>
                  <li onClick={toggleSidebar}>
                    <Link href="/manage-users">
                      <Button variant="ghost" className="justify-start w-full">
                        <UserRoundCog className="mr-2 w-4 h-4" />
                        Manage Users
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                {/* Dynamica access Routes ends here ................ */}
                <li onClick={toggleSidebar}>
                  <Link href="/profile">
                    <Button variant="ghost" className="justify-start w-full">
                      <User2 className="mr-2 w-4 h-4" />
                      Profile
                    </Button>
                  </Link>
                </li>
                <li onClick={toggleSidebar}>
                  <Link href="/download">
                    <Button variant="ghost" className="justify-start w-full">
                      <Download size={18} className="mr-2 w-4 h-4" />
                      Download
                    </Button>
                  </Link>
                </li>
                <OnlyAllowed
                  allowedRoles={["Admin"]}
                >
                  <li onClick={toggleSidebar}>
                    <Link href="/password-reset-link">
                      <Button variant="ghost" className="justify-start w-full">
                        <KeyRound className="mr-2 w-4 h-4" />
                        Change Password
                      </Button>
                    </Link>
                  </li>
                </OnlyAllowed>
                <li>
                  <ThemeChanger />
                </li>
              </ul>
              <div className="sticky bottom-0 h-8 w-full bg-gradient-to-t from-background to-transparent z-10"></div>
            </nav>
            <div className="mt-auto h-[15%]">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
