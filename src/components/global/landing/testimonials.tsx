export default function Testimonials() {
  const testimonials = [
    {
      title: "Finally, a tool that connects everything I need in one place!",
      description:
        "This app has transformed the way I manage my workflows. The integration with GitHub, Slack, and Asana means I don’t have to juggle multiple tools anymore—it’s all seamlessly connected in one workspace. ",
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
  ];
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="text-center font-bold tracking-tight text-5xl">
          How Quirk Transforms Workflows
        </h2>

        <div className="mt-10 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="mb-8 sm:break-inside-avoid">
              <blockquote className="rounded-lg bg-gray-200 dark:bg-neutral-800 p-6 shadow-xl sm:p-8">
                <h5 className="font-bold text-xl">{testimonial.title}</h5>
                <p className="mt-4">{testimonial.description}</p>
              </blockquote>
            </div>
          ))}{" "}
        </div>
      </div>
    </section>
  );
}
