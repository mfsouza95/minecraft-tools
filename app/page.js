import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen" style={{backgroundImage: "url('/images/minecraftBackground.png')"}}>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative z-10">
        <div className="border-2 rounded-sm p-4 flex justify-center w-fit mx-auto">
          <h1 className="font-[family-name:var(--font-minecraft)] text-4xl">MC TOOLS</h1>
        </div>
        <Link href="/nether">Nether</Link>
        <Link href="/crafting">Crafting</Link>
      </div>
    </div>
  );
}
