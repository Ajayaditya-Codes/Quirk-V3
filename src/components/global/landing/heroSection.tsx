import Link from "next/link";
import SignUp from "./signup";
import HeroImage from "./heroImages";
import { MoveUpRightIcon } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="my-[200px] text-center flex flex-col items-center justify-center w-full gap-y-5">
      <h1 className="text-6xl font-medium  leading-[1.2]">
        Automate your GitHub <br /> Workflow with Quirk
      </h1>
      <p className="text-xl">
        Transform your Project Management across GitHub, Slack and Asana
      </p>
      <div className="flex flex-row gap-x-5 mt-5 items-center justify-center">
        <Link
          href="/pricing"
          className="text-lg hover:underline flex flex-row items-center justify-center gap-x-1"
        >
          Pricing and Plans <MoveUpRightIcon size={15} />
        </Link>
        <SignUp />
      </div>
      <div className="w-[80vw]">
        <HeroImage />
      </div>
      <div className=" flex flex-col items-center justify-center gap-y-5 mt-[200px] w-[850px]">
        <h5 className="text-4xl">
          Effortless Workflow Automation Across GitHub, Slack, and Beyond
        </h5>
        <p className="text-xl  ">
          Streamline your workflows by automating key tasks across your favorite
          tools. Effortlessly connect GitHub with platforms like Slack, Asana,
          and more—creating powerful, custom automations without the need for
          developers. From notifying your team on Slack about updates in GitHub
          to syncing tasks with Asana, our automation builder empowers you to
          turn your ideas into actions. Simplify your processes, reduce manual
          work, and bring your projects to life with automations that adapt to
          your needs.
        </p>
      </div>
    </div>
  );
}
