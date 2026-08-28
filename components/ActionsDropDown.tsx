import { AppDropDown } from './AppDropdown';
import { DropdownMenuItem } from './ui/dropdown-menu';

type ActionsDropDownProps = {
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
};
export default function ActionsDropDown({ onEdit, onDelete, className }: ActionsDropDownProps) {
    return (
        <AppDropDown className={className}>
            <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
                Edit
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={onDelete}>
                Delete
            </DropdownMenuItem>
        </AppDropDown>
    );
}
