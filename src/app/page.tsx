import { PathMap } from "@/components/map/PathMap";
import { TopBar } from "@/components/map/TopBar";
import { islands, upcomingIslands } from "@/content";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="flex-1">
        <PathMap islands={islands} upcoming={upcomingIslands} />
      </main>
    </>
  );
}
