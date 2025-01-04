import { CardStack } from "@/components/ui/cardStack";

export default function CardsTestimonial() {
  const testimonials = [
    {
      id: 1,
      content:
        "This app connects everything I need in one place! Integrating GitHub, Slack, and Asana has transformed how I manage workflows. I no longer juggle multiple tools—it’s all seamlessly connected, saving me so much time.",
    },
    {
      id: 2,
      content:
        "The drag-and-drop editor is a game-changer. It’s so intuitive and easy to use, even for non-tech-savvy users. I can build complex workflows in minutes, making automation effortless and saving tons of effort.",
    },
    {
      id: 3,
      content:
        "The focus on security and accessibility is impressive. Logging in with Firebase Authentication feels secure, and the ARIA compatibility makes the app inclusive. It’s clear a lot of thought went into this design.",
    },
    {
      id: 4,
      content:
        "This app works wherever I do. Whether on my laptop, tablet, or phone, it’s always there. As a PWA with Capacitor integration, it feels like a native app and even works offline when I need it most.",
    },
    {
      id: 5,
      content:
        "Error handling is seamless. Whenever something goes wrong, a toast message gently notifies me. No crashes or confusion—just reliable error management that keeps everything running smoothly.",
    },
    {
      id: 6,
      content:
        "The personalization options are fantastic. I love switching between light and dark modes, and the responsive design ensures it looks great on any screen size. It’s perfect for day and night use!",
    },
    {
      id: 7,
      content:
        "The real-time analytics are incredibly helpful. The dashboard gives detailed insights, showing how workflows perform every month. It helps me refine my processes and stay on top of what works best.",
    },
  ];

  return (
    <div className="mb-[200px] text-center flex flex-col items-center justify-center w-full gap-y-[100px]">
      <h2 className="text-xl  text-center bg-[#8a00c4] px-7 py-3 rounded-2xl font-semibold text-white">
        Project Highlights
      </h2>
      <CardStack items={testimonials} />
    </div>
  );
}
