import Image from "next/image";
import { IconBrandOpenai, IconLogs, IconSchema } from "@tabler/icons-react";
import { JSX } from "react";

export default function FeaturesSection() {
  type Feature = {
    name: string;
    description: string;
    icon: JSX.Element;
  };

  const features: Feature[] = [
    {
      name: "Dynamic Workflow Automation",
      description:
        "Effortlessly create custom workflows with triggers and actions using a drag-and-drop editor. Automate GitHub, Slack, and Asana tasks seamlessly.",
      icon: <IconSchema color="#8a00c4" />,
    },
    {
      name: "Intelligent GPT Node",
      description:
        "Leverage the GPT Node to transform raw data into actionable insights without the need for templates. Automate message creation intelligently.",
      icon: <IconBrandOpenai color="#8a00c4" />,
    },
    {
      name: "Comprehensive Activity Logs",
      description:
        "Track workflow updates, triggers, and actions in real-time with detailed logs, ensuring complete visibility and control over automations.",
      icon: <IconLogs color="#8a00c4" />,
    },
  ];

  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-[#8a00c4]">
                Manage Your GitHub with Ease
              </h2>
              <p className="mt-2 text-pretty text-5xl font-semibold tracking-tight ">
                A Better Workflow
              </p>
              <div className="mt-10 max-w-xl space-y-8 text-xl lg:max-w-none">
                {features.map((feature) => (
                  <div className="flex flex-col space-y-3" key={feature.name}>
                    <div className="flex flex-row space-x-2 justify-start items-center">
                      {feature.icon}
                      <h3 className="font-semibold text-pretty">
                        {feature.name}
                      </h3>
                    </div>
                    <p className="text-lg/8 text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Image
            alt="Product screenshot"
            src="/hero-dark-sm.png"
            width={2600}
            height={1800}
            className="w-[55rem] max-w-none rounded-xl shadow-xl sm:w-[65rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
