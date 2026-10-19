import { MapBackdrop } from "@/components/map/MapBackdrop";
import { PathMap } from "@/components/map/PathMap";
import { TopBar } from "@/components/map/TopBar";
import { TabBar } from "@/components/nav/TabBar";
import { islands, upcomingIslands } from "@/content";

export default function Home() {
  return (
    <>
      <TopBar />
      <main className="relative flex-1">
        <MapBackdrop />
        <PathMap islands={islands} upcoming={upcomingIslands} />
      </main>
      <TabBar />
    </>
  );
}
