import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer frame flex flex-wrap items-center justify-between gap-6 py-10">
      <Link href="/" className="font-medium">
        SchoolSoft+ Developer
      </Link>
      <p>Independent. Open source. Built by a student.</p>
      <a href="https://github.com/elias4044/schoolsoftplus">
        Follow the source
      </a>
    </footer>
  );
}
