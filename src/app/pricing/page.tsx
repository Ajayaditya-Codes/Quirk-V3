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
  return (
    <div className="w-full">
      <HeaderNav />
      <main className="p-10">
        <div className="flex flex-col items-center justify-center mt-[100px]">
          <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-2xl font-bold text-center  leading-[1.2]">
            Simple, Transparent Pricing for Every Team
          </h1>
          <p className="md:text-xl sm:text-lg xs:text-base text-center mt-5 max-w-[800px]">
            Choose the plan that fits your needs and start automating workflows
            effortlessly. From startups to enterprises, we’ve got the perfect
            solution to help you save time, boost productivity, and focus on
            what matters most—without hidden fees or surprises.
          </p>
          <div className="flex lg:flex-row flex-col justify-center items-center lg:gap-x-10 gap-y-10 lg:gap-y-0 mt-20">
            <Card className="border min-h-[650px] shadow-xl w-[80vw] max-w-[400px] rounded-2xl">
              <CardHeader className="font-semibold">Basic</CardHeader>
              <CardContent>
                <h2 className="text-7xl font-semibold">$0</h2>
                <p className="leading-snug text-justify mt-5">
                  Start your automation journey with essential features to
                  streamline your workflows. Perfect for individuals or small
                  teams exploring the possibilities of automation. No credit
                  card required.
                </p>
                <div className="my-10">
                  <SignUp />
                </div>
                <h3 className="text-xl font-semibold mb-3">What's Included:</h3>
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
                            Webhook Trigger on Active Workflow costs a Credit.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                  <li>Community Support</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="w-[80vw] max-w-[400px] min-h-[650px] text-white bg-[#8a00c4] border-0 relative rounded-2xl before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:blur-xl before:bg-gradient-to-r before:from-red-500 before:via-yellow-500 before:to-purple-500">
              <CardHeader className="font-semibold">Premium</CardHeader>
              <CardContent>
                <div className="flex flex-row justify-start items-end">
                  <h2 className="text-7xl font-semibold">$10</h2>
                  <p className="mb-2 text-lg font-semibold">/month</p>
                </div>
                <p className="leading-snug text-justify mt-5">
                  Take your productivity to the next level with advanced
                  features and priority support. Designed for growing teams and
                  businesses needing robust tools and enhanced capabilities.
                  Let's build your perfect solution together.
                </p>
                <button className="sm:px-5 px-3 font-semibold md:py-3 py-2 rounded-xl  text-sm md:text-base  md:rounded-2xl my-10  text-white border border-white bg-transparent">
                  Contact Dev Team
                </button>
                <h3 className="text-xl font-semibold mb-3">What's Included:</h3>
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
      </main>
    </div>
  );
}
