import { BentoGrid, BentoGridItem } from "@/components/ui/bentoGrid";

export default function Testimonials() {
  const testimonials = [
    {
      title: "Finally, a tool that connects everything I need in one place!",
      description:
        "This app has transformed the way I manage my workflows. The integration with GitHub, Slack, and Asana means I don’t have to juggle multiple tools anymore—it’s all seamlessly connected in one workspace. Now, every action triggers the right response without me lifting a finger!",
    },
    {
      title: "The drag-and-drop editor is an absolute game-changer.",
      description:
        "I was blown away by how easy it is to build workflows. The drag-and-drop interface feels intuitive, even for someone like me who isn’t tech-savvy. I can create complex workflows in minutes, saving so much time and effort.",
    },
    {
      title:
        "I appreciate the thoughtful approach to security and accessibility.",
      description:
        "Logging in with Firebase Authentication feels super secure, and I love that the app is ARIA-compatible. It’s clear that a lot of care went into making this inclusive for everyone.",
    },
    {
      title: "It works everywhere I do.",
      description:
        "Whether I’m on my laptop, tablet, or phone, this app is always there. The fact that it’s a Progressive Web App means I can even use it offline. Plus, with the Capacitor integration, it feels like a native app on all my devices.",
    },
    {
      title: "Error handling is seamless and non-intrusive.",
      description:
        "Whenever something doesn’t go as planned, the app gently notifies me with a toast message. No crashing, no confusion—just straightforward error management. It’s such a relief to use something so reliable.",
    },
    {
      title: "The personalization options are fantastic.",
      description:
        "Theming is such a thoughtful feature! I can switch between light and dark modes depending on the time of day, and the responsive design means everything looks great, no matter the screen size.",
    },
    {
      title:
        "Real-time analytics have taken my productivity to the next level.",
      description:
        "I love the analytics dashboard—it’s incredibly detailed! I can see how many actions each workflow performs every month, helping me identify what’s working and what needs tweaking. It’s like having my own performance coach!",
    },
  ];
  return (
    <div className="my-[200px] text-center flex flex-col items-center justify-center w-full gap-y-5">
      <h2 className="text-xl  text-center bg-[#8a00c4] px-7 py-3 rounded-2xl font-semibold text-white">
        Project Highlights
      </h2>
      <BentoGrid className="w-[70%] mx-auto mt-5">
        {testimonials.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>{" "}
    </div>
  );
}
