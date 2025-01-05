import Link from "next/link";
import SignUp from "./signup";
import HeroImage from "./heroImages";
import { MoveUpRightIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="my-[200px] text-center flex flex-col items-center justify-center w-full gap-y-5">
      <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-medium  leading-[1.2]">
        Automate your GitHub <br /> Workflow with Quirk
      </h1>
      <p className="md:text-xl sm:text-lg xs:text-base">
        Transform your Project Management <br className="flex md:hidden" />{" "}
        across GitHub, Slack and Asana
      </p>
      <div className="flex flex-row gap-x-5 mt-5 items-center justify-center">
        <Link
          href="/pricing"
          prefetch={true}
          className="text-sm sm:text-base md:text-lg hover:underline flex flex-row items-center justify-center gap-x-1"
        >
          Pricing and Plans <MoveUpRightIcon size={15} />
        </Link>
        <SignUp />
      </div>
      <div className="w-[90vw] md:w-[80vw]">
        <HeroImage />
      </div>
      <div className=" flex flex-col items-center justify-center gap-y-5 mt-[200px] max-w-[850px]">
        <h5 className="lg:text-4xl md:text-2xl text-xl font-semibold lg:font-medium">
          Effortless Workflow Automation Across GitHub, Slack, and Beyond
        </h5>
        <p className="lg:text-xl md:text-lg text-base">
          Streamline your workflows by automating tasks across your favorite
          tools. Effortlessly connect GitHub with platforms like Slack and Asana
          to create powerful, custom automations—no developers needed. Notify
          your team, sync tasks, and reduce manual work with an automation
          builder designed to adapt to your needs.
        </p>
      </div>
    </div>
  );
}
