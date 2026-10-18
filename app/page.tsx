import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Numbers } from "@/components/Numbers";
import { Terminal } from "@/components/Terminal";
import { WishesAhead } from "@/components/WishesAhead";
import { WishesWall } from "@/components/WishesWall";

export default function Home() {
  return (
    <>
      <Background />
      <Nav />
      <main>
        <Hero />
        <Numbers />
        <Terminal />
        <WishesAhead />
        <WishesWall />
      </main>
      <Footer />
    </>
  );
}
