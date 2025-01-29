import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { SongRow } from "./SongRow";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const user = {
    name: session?.user.name || "",
    avatarUrl: session?.user?.image || "",
    songsCount: await prisma.song.count({
      where: { artist: { userId: session.user.id } },
    }),
  };

  const songs = await prisma.song.findMany({
    where: { artist: { userId: session.user.id } },
  });

  return (
    <div className="min-h-screen transition-colors duration-200 px-10 pt-3">
      <header className="bg-white dark:bg-background shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-20 w-20 mr-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="mr-4">{user.songsCount} songs</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between w-full">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Published Songs
            </h2>

            <Link href="/dashboard/songs/create">
              <Button>
                <Plus />
                Add
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-background shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {songs.map((song) => (
                <SongRow song={song} key={song.tokenId} />
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
