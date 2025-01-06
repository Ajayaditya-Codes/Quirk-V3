import { ScrollArea } from "@/components/ui/scroll-area";
import VariableButton from "./variableButton";
import { GithubVariables } from "./githubVariables";

const VariableScrollArea: React.FC<{
  onClick: (variable: string) => void;
}> = ({ onClick }) => (
  <ScrollArea className="flex w-full rounded-xl border max-h-[200px] overflow-y-auto">
    {GithubVariables.map((variable, idx) => (
      <VariableButton
        key={idx}
        onClick={() => onClick(variable)}
        variable={variable}
      />
    ))}
  </ScrollArea>
);

export default VariableScrollArea;
