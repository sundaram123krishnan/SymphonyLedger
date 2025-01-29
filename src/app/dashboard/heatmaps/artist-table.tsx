import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { view } from "framer-motion";

const items = [
  {
    id: "1",
    name: "Alex Thompson",
    username: "@alexthompson",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358071/avatar-40-02_upqrxi.jpg",
    song: "Animals",
    views: "10",
  },
  {
    id: "2",
    name: "Sarah Chen",
    username: "@sarahchen",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358073/avatar-40-01_ij9v7j.jpg",
    song: "Faded",
    views: "100",
  },
  {
    id: "4",
    name: "Maria Garcia",
    username: "@mariagarcia",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358072/avatar-40-03_dkeufx.jpg",
    song: "Beautiful",
    views: "1k",
  },
  {
    id: "5",
    name: "David Kim",
    username: "@davidkim",
    image:
      "https://res.cloudinary.com/dlzlfasou/image/upload/v1736358070/avatar-40-05_cmz0mg.jpg",
    song: "Rap God",
    views: "500",
  },
];

export function ArtistTable() {
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
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full"
                    src={item.image}
                    width={40}
                    height={40}
                    alt={item.name}
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {item.username}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.song}</TableCell>
              <TableCell>{item.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
