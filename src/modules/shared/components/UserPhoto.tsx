import Image from "next/image";
import { toKey } from "@/modules/shared/utils/helper";

type Props = { photoUrl: string | null | undefined };

function UserPhoto({ photoUrl }: Props) {
  let src: string;

  if (!photoUrl) src = "/default-user.png";
  const key = toKey(photoUrl);

  src = key
    ? `/api/storage/image?key=${encodeURIComponent(key)}`
    : "/default-user.png";

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full">
      <Image
        src={src}
        alt="profile"
        fill
        sizes="40px"
        className="object-cover"
        unoptimized // avoids optimizer weirdness in dev
      />
    </div>
  );
}

export default UserPhoto;
