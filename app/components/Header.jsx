'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

export default function Header(){
    const pathname = usePathname();
    const isHome = pathname === '/';

    return(
        <header className={isHome ? 'absolute w-full top-0 py-4' : 'absolute w-full top-0 py-4'}>
            {pathname !== '/' && (
                <Link href="/" className="rounded-sm bg-white text-black py-2 px-6 m-2">Return</Link>
            )}
        </header>
    );
}