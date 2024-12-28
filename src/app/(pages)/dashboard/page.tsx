import Header from "@/components/global/header";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col">
      <Header route="Dashboard" />
      <div className="w-full p-[3vh]">
        <h1>Dash</h1>
      </div>
    </div>
  );
}
