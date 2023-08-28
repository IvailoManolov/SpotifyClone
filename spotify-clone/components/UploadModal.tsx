"use client";

import useUploadModal from "@/hooks/useUploadModal";

import { useState } from 'react';

import Modal from "./Modal";

import { FieldValues, useForm, SubmitHandler } from "react-hook-form";
import Input from "./Input";

const UploadModal = () => {

    const uploadModal = useUploadModal();
    const [isLoading, setIsLoading] = useState();

    const { register, handleSubmit, reset } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            song: null,
            image: null
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        //Upload to supabase.

    }

    const onChange = (open: boolean) => {

        if (!open) {
            // Reset the form
            reset();
            uploadModal.onClose();
        }
    }

    return (
        <Modal title="Add a song" description="Upload an mp3 file" isOpen={uploadModal.isOpen} onChange={onChange}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register('title', { required: true })}
                    placeholder="Song title"
                />
            </form>
        </Modal>
    );
}

export default UploadModal;