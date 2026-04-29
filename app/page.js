import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>MC TOOLS</h1>
      <Link href = "/nether">Nether</Link>
      <Link href = "/crafting">Crafting</Link>
    </div>
  );
}
