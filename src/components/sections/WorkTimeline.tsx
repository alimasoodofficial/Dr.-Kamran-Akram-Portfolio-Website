import ProcessTimeline from "../ui/ProcessTimeline";

export default function WorkTimeline() {
  
  const timelineData = [
    {
      title: "1. Select Your Package",
      description: "Choose between a Quick-Fire session, a Deep-Dive consultation, or long-term Mentorship based on your current needs and budget.",
      icon: "fas fa-hand-pointer"
    },
    {
      title: "2. Complete Intake Form",
      description: "Provide some background info and upload your CV, research proposal, or LinkedIn link so Dr. Kamran can review them before the call.",
      icon: "fas fa-file-pen"
    },
    {
      title: "3. One-on-One Call",
      description: "Meet via video call at your scheduled time for a focused discussion, document feedback, and direct answers to your questions.",
      icon: "fas fa-video"
    },
    {
      title: "4. Personalized Follow-up",
      description: "Receive a detailed email summary containing key discussion points, a custom action checklist, and helpful resources to guide your next move.",
      icon: "fas fa-envelope-open-text"
    }
  ];

  return (
    <main>
      <ProcessTimeline 
        
        steps={timelineData}
        
        accentColorClass="text-[#E67E22] card"
        accentBgClass="bg-[#fdf2e9]"
        containerClassName="dark:bg-gray-900 "
      />
    </main>
  );
}