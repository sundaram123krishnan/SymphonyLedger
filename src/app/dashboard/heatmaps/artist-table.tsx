import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";

export async function ArtistTable() {
  const items = await prisma.artist.findMany({
    take: 3,
    orderBy: { songs: { _count: "desc", } },
    include: { user: true },
  });

  return (
    <div className="bg-background" suppressHydrationWarning={true}>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Artist Name</TableHead>
            <TableHead>Song</TableHead>
            <TableHead>Views</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.metamaskAddress}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full"
                    src={item.user.image}
                    width={40}
                    height={40}
                    alt={item.user.name}
                  />
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {item.user.email}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
