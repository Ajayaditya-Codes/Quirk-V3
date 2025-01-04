"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function SignUp() {
  return (
    <RegisterLink>
      <button className="sm:px-5 px-3 font-semibold md:py-3 py-2 rounded-xl  text-sm md:text-base  md:rounded-2xl bg-[#8a00c4] text-white">
        Get Started <span className="sm:inline hidden">for Free</span>{" "}
      </button>
    </RegisterLink>
  );
}
