'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/forms/FormField';
import { FormTextArea } from '@/components/forms/FormTextArea';
import { ValidatedForm } from '@/components/forms/ValidatedForm';

import { editSchema } from '@/schemas/common';
import { EditInput, Video } from '@/types';

type VideoDetailsProps = {
    video: Video;
    onSubmit: (data: EditInput) => void;
    isPending: boolean;
};

export default function VideoDetails({ video, onSubmit, isPending }: VideoDetailsProps) {
    const [title, setTitle] = useState(video.title || '');
    const [description, setDescription] = useState(video.description || '');
    const [showFullDescription, setShowFullDescription] = useState(false);

    const madeChange = title !== (video.title || '') || description !== (video.description || '');

    return (
        <>
            <ValidatedForm
                schema={editSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set([])}
            >
                <FormField
                    type="text"
                    label="title"
                    id="title"
                    hideLabel
                    value={title}
                    onChange={setTitle}
                    inputClassName="border-0 p-1 text-xl font-semibold tracking-tight focus-visible:ring-1 dark:bg-transparent"
                />

                <FormTextArea
                    id="description"
                    label="description"
                    hideLabel
                    value={description}
                    onChange={(value) => {
                        setDescription(value);
                        setShowFullDescription(true);
                    }}
                    className="mt-3"
                    textareaClassName={`rounded-sm resize-none border-0 bg-muted/90 p-4 text-sm leading-relaxed text-muted-foreground shadow-none focus-visible:border-1 focus-visible:ring-0 dark:bg-transparent ${
                        showFullDescription
                            ? 'min-h-6 h-auto overflow-hidden field-sizing-content'
                            : 'h-[100px] overflow-hidden'
                    }`}
                />

                {madeChange && (
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save'}
                    </Button>
                )}
            </ValidatedForm>
            {!madeChange && description.length > 300 && (
                <button
                    type="button"
                    onClick={() => setShowFullDescription((current) => !current)}
                    className="mt-2 text-sm font-medium text-link hover:underline"
                >
                    {showFullDescription ? 'Show less' : 'Show more'}
                </button>
            )}
        </>
    );
}
