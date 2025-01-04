import Image from "next/image";
import SignUp from "./signup";
import Link from "next/link";

export default function HeaderNav() {
  return (
    <div className="w-full z-50 fixed top-0 flex flex-row justify-between items-center bg-white p-5 px-10 dark:bg-black">
      <Link href="/">
        <div className="flex flex-row items-center justify-center gap-x-3">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="rounded-2xl"
          />
          <h3 className="text-3xl -mt-2 -ml-5 font-semibold">Quirk</h3>
        </div>
      </Link>
      <SignUp />
    </div>
  );
}
