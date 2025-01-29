"use client";

import * as React from "react";
import {
  Album,
  AudioWaveform,
  BarChart3,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  Mic,
  Music,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: session,
  } = useSession()

  const data = {
    user: {
      name: session?.user.name,
      email: session?.user.email,
      avatar: session?.user?.image,
    },
    teams: [
      {
        name: "SymphonyLedger",
        logo: Music,
        plan: "Blockchain",
      },
    ],
    navMain: [
      {
        title: "Home",
        url: "/dashboard",
        icon: Home
      },
      {
        title: "Stakeholders",
        url: "/dashboard/add-stakeholder",
        icon: Users
      },
      {
        title: "Albums",
        url: "/dashboard/albums/create",
        icon: Album
      },
      {
        title: "Artists",
        url: "/dashboard/artists",
        icon: Mic
      },
      {
        title: "Songs",
        url: "/dashboard/songs",
        icon: Music
      },
      {
        title: "Leaderboard",
        url: "/dashboard/leaderboard",
        icon: BarChart3
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex items-center justify-between">
        <Link href="/">
          <SidebarHeader>
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>
        </Link>

        <div className="mr-4"><ModeToggle /></div>
      </div>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
