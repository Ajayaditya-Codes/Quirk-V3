import HeaderNav from "@/components/global/landing/headerNav";
import SignUp from "@/components/global/landing/signup";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconQuestionMark } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Pricing() {
  const email = "ajayaditya.dev@proton.me";

  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="mx-auto max-w-3xl py-10">
            <div className="md:text-center">
              <h1 className="text-balance text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight">
                Simple, Transparent Pricing for Every Team
              </h1>
              <p className="mt-8 text-pretty text-2xl font-medium text-gray-500 dark:text-gray-100">
                Choose the plan that fits your needs and start automating
                workflows effortlessly.
              </p>
              <div className="flex lg:flex-row flex-col justify-center items-center lg:gap-x-10 gap-y-10 lg:gap-y-0 mt-20">
                <Card className="items-start text-start border-[#8a00c4] border-2 min-h-[700px] shadow-xl w-[80vw] max-w-[400px] rounded-2xl">
                  <CardHeader className="font-semibold ">Basic</CardHeader>
                  <CardContent>
                    <h2 className="text-7xl font-semibold ">$0</h2>
                    <p className="leading-snug text-justify text-xl mt-5">
                      Start your automation journey with essential features to
                      streamline your workflows. Perfect for individuals or
                      small teams exploring the possibilities of automation. No
                      credit card required.
                    </p>
                    <div className="my-10">
                      <SignUp />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      What's Included:
                    </h3>
                    <ul className="gap-y-2 flex flex-col">
                      <li>Access to Core Workflow Builder</li>
                      <li>5 Active Workflows</li>
                      <li className="flex flex-row items-center gap-x-2 ">
                        20 Free Credits{" "}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {" "}
                              <IconQuestionMark
                                size={18}
                                className="border rounded-full dark:bg-white bg-black text-white dark:text-black"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Webhook Trigger on Active Workflow costs a
                                Credit.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </li>
                      <li>Community Support</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="items-start text-start w-[80vw] max-w-[400px] min-h-[700px] text-white bg-[#8a00c4] border-0 relative rounded-2xl before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-xl before:bg-gradient-to-r before:from-red-500 before:via-yellow-500 before:to-purple-500">
                  <CardHeader className="font-semibold ">Premium</CardHeader>
                  <CardContent>
                    <div className="flex flex-row justify-start items-end">
                      <h2 className="text-7xl font-semibold">$10</h2>
                      <p className="mb-2 text-lg font-semibold">/month</p>
                    </div>
                    <p className="leading-snug text-justify text-xl mt-5">
                      Take your productivity to the next level with advanced
                      features and priority support. Designed for growing teams
                      and businesses needing robust tools and enhanced
                      capabilities. Let's build your perfect solution together.
                    </p>
                    <a
                      href={`mailto:${email}`}
                      className="sm:px-5 px-3 font-semibold md:py-3 py-2 rounded-xl  text-sm md:text-base  md:rounded-2xl my-10  text-white border border-white bg-transparent flex w-fit"
                    >
                      Contact Dev Team
                    </a>
                    <h3 className="text-xl font-semibold mb-3">
                      What's Included:
                    </h3>
                    <ul className="gap-y-2 flex flex-col">
                      <li>Everything in the Basic Plan</li>
                      <li>Unlimited Active Workflows</li>
                      <li className="flex flex-row items-center gap-x-2 ">
                        Unlimited Credits
                      </li>
                      <li>Early Access to Features</li>
                      <li>VIP Support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
