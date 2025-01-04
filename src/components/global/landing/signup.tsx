"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function SignUp() {
  return (
    <RegisterLink>
      <button className="px-5 font-semibold py-3 rounded-2xl bg-[#8a00c4] text-white">
        Get Started for Free
      </button>
    </RegisterLink>
  );
}
