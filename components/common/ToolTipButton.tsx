import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type ToolTipButtonProps = {
    button: React.ReactElement;
    content: string;
    icon?: React.ReactNode;
};
export default function ToolTipButton({ button, content, icon }: ToolTipButtonProps) {
    return (
        <Tooltip>
            <TooltipTrigger render={button}>{icon}</TooltipTrigger>

            <TooltipContent>
                <p>{content}</p>
            </TooltipContent>
        </Tooltip>
    );
}
