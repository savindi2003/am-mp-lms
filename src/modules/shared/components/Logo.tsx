"use client";
import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  configStyles?: string;
  logoUrl?: string;
  linkUrl?: string;
};

function Logo({ configStyles, logoUrl, linkUrl }: LogoProps) {
  return (
    <div className={`w-[5rem] md:w-[10rem] ${configStyles}`}>
      <Link href={linkUrl || "/"}>
        <Image
          src={logoUrl || "/logo/logo1.png"}
          alt="Milan Pitagaldeniya"
          width={150}
          height={60}
        />
      </Link>
    </div>
  );
}

export default Logo;
