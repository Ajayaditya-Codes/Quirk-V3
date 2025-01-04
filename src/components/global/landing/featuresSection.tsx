import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  IconBrandAsana,
  IconBrandGithub,
  IconBrandOpenai,
  IconBrandSlack,
  IconBrandTrello,
  IconGitBranch,
  IconWebhook,
} from "@tabler/icons-react";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <div className="flex md:flex-row flex-col w-[70vw] my-[200px] mx-auto justify-center items-center gap-y-10 md:gap-y-0 md:gap-x-10 ">
      <Card className="h-[800px] items-center flex justify-center md:basis-1/3">
        <CardContent>
          <div className=" flex flex-col items-center justify-center">
            <Image
              src={"/analytics.svg"}
              alt="logo"
              width={500}
              height={500}
              className="rounded-2xl"
            />

            <div className="mt-10 flex flex-col gap-y-5 text-center">
              <h5 className="text-2xl">Track Actions, Optimize Performance</h5>
              <p className="text-lg">
                Stay ahead with actionable insights. Track monthly actions for
                every workflow, identify trends, and optimize processes—all in
                one dynamic analytics dashboard built to enhance efficiency and
                performance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-[800px] items-center flex justify-center basis-1/3">
        <CardContent>
          <div className=" flex flex-col items-center justify-center">
            <div className="relative flex h-[500px] w-full flex-col items-center justify-center">
              <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-black">
                Quirk
              </span>

              <OrbitingCircles>
                <IconBrandAsana size={40} />
                <IconBrandOpenai size={40} />
                <IconBrandGithub size={40} />
                <IconGitBranch size={40} />
                <IconWebhook size={40} />
              </OrbitingCircles>
              <OrbitingCircles radius={100} reverse speed={2}>
                <IconBrandOpenai size={40} />
                <IconBrandSlack size={40} />
                <IconBrandTrello size={40} />
                <IconBrandGithub size={40} />
              </OrbitingCircles>
            </div>
            <div className="flex flex-col gap-y-5 text-center">
              <h5 className="text-2xl">
                Unified Workspace for Seamless Integration
              </h5>
              <p className="text-lg">
                Bring all your favorite tools together in one place. Integrate
                GitHub, Slack, Asana, and more within a single, cohesive
                workspace designed for effortless collaboration and
                productivity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-[800px] items-center flex justify-center basis-1/3">
        <CardContent>
          <div className=" flex flex-col items-center justify-center">
            <span className="dark:bg-neutral-900  bg-white rounded-xl items-center p-5 flex flex-row space-x-5 border-[#FF0083] border">
              <IconBrandOpenai />
              <div className="flex flex-col justify-start items-start">
                <h5 className="text-lg font-semibold">GPT Webhook Handler</h5>
                <p className="text-gray-400">Generate Messages using GPT</p>
              </div>
            </span>
            <div className="mt-10 flex flex-col gap-y-5 text-center">
              <h5 className="text-2xl">Powered by GPT</h5>
              <p className="text-lg">
                Streamline your workflows with AI-powered automation. Our app
                uses GPT to transform GitHub webhook payloads into actionable
                message text, saving time and reducing manual effort.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Say
//           Goodbye to Switching Apps and Messy Processes
//           Replace the Manual Process of Assigning Tasks and Posting
//           Messages with a simple and easy to use Automation Tool"""
