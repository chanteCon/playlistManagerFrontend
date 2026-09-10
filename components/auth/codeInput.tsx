'use client';

import { InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useFormContext } from '@/contexts/ValidatedFormContext';

export default function CodeInput({ boxStyle }: { boxStyle: string }) {
    const { errors } = useFormContext();

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <InputOTPGroup className="gap-1">
                <InputOTPSlot index={0} className={boxStyle} />
                <InputOTPSlot index={1} className={boxStyle} />
                <InputOTPSlot index={2} className={boxStyle} />
                <InputOTPSlot index={3} className={boxStyle} />
                <InputOTPSlot index={4} className={boxStyle} />
                <InputOTPSlot index={5} className={boxStyle} />
            </InputOTPGroup>

            {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
        </div>
    );
}
