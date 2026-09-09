import { InputOTPGroup, InputOTPSlot } from '../ui/input-otp';

export default function CodeInput({ boxStyle }: { boxStyle: string }) {
    return (
        <InputOTPGroup className="gap-1">
            <InputOTPSlot index={0} className={boxStyle} />
            <InputOTPSlot index={1} className={boxStyle} />
            <InputOTPSlot index={2} className={boxStyle} />
            <InputOTPSlot index={3} className={boxStyle} />
            <InputOTPSlot index={4} className={boxStyle} />
            <InputOTPSlot index={5} className={boxStyle} />
        </InputOTPGroup>
    );
}
