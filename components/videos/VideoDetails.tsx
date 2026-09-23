'use client';

import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { FormField } from '@/components/forms/FormField';
import { FormTextArea } from '@/components/forms/FormTextArea';
import { ValidatedForm } from '@/components/forms/ValidatedForm';

import { editSchema } from '@/schemas/common';

import { EditInput, ServerErrorState, ValidatedFormRef, Video } from '@/types';

type VideoDetailsProps = {
    video: Video;
    onSubmit: (data: EditInput) => void;
    isPending: boolean;
    serverErrorState?: ServerErrorState;
};

export default function VideoDetails({
    video,
    onSubmit,
    isPending,
    serverErrorState,
}: VideoDetailsProps) {
    const [title, setTitle] = useState(video.title || '');
    const [description, setDescription] = useState(video.description || '');
    const [showFullDescription, setShowFullDescription] = useState(false);

    const madeChange = title !== (video.title || '') || description !== (video.description || '');
    const validatedFormRef = useRef<ValidatedFormRef>(null);

    const handleCancel = () => {
        setTitle(video.title || '');
        setDescription(video.description || '');
        setShowFullDescription(false);
        validatedFormRef.current?.clearErrors();
    };

    return (
        <>
            <ValidatedForm
                schema={editSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set([])}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
                ref={validatedFormRef}
            >
                <FormField
                    type="text"
                    label="title"
                    id="title"
                    hideLabel
                    value={title}
                    onChange={setTitle}
                    placeHolder="No title"
                    inputClassName="border-1 p-3 text-xl font-semibold tracking-tight focus-visible:ring-1 dark:bg-transparent"
                />

                {madeChange && (
                    <div className="mt-2 flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                )}

                <FormTextArea
                    id="description"
                    label="description"
                    hideLabel
                    value={description}
                    onChange={(value) => {
                        setDescription(value);
                        setShowFullDescription(true);
                    }}
                    placeHolder="No description"
                    className="mt-3"
                    textareaClassName={`resize-none rounded-sm border bg-muted/90 p-3 text-sm leading-relaxed text-muted-foreground shadow-none focus-visible:border-1 focus-visible:ring-1 dark:bg-transparent ${
                        showFullDescription
                            ? 'min-h-6 h-auto overflow-hidden field-sizing-content'
                            : 'h-[100px] overflow-hidden'
                    }`}
                />
            </ValidatedForm>

            {!madeChange && description.length > 300 && (
                <button
                    type="button"
                    onClick={() => setShowFullDescription((current) => !current)}
                    className="mt-2 cursor-pointer text-sm font-medium text-link hover:underline"
                >
                    {showFullDescription ? 'Show less' : 'Show more'}
                </button>
            )}
        </>
    );
}
