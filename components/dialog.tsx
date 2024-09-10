"use client";

import { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";

type Props = {
    title: string,
    onClose: () => void,
    onOk: () => void,
    children: React.ReactNode,
    isOpen: boolean,
}

export default function Dialog({ title, onClose, onOk, children, isOpen }: Props) {
    const dialogRef = useRef<null | HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [isOpen]);

    const closeDialog = () => {
        dialogRef.current?.close()
        onClose()
    };

    const clickOk = () => {
        onOk()
        closeDialog()
    };

    const dialog: JSX.Element | null = isOpen
        ? (
            <dialog ref={dialogRef} className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-10  rounded-xl backdrop:bg-gray-800/50">
                <div className="w-[500px] max-w-fullbg-gray-200 flex flex-col">
                    <div className="flex flex-row justify-between mb-4 pt-2 px-5 bg-primary text-primary-foreground">
                        <h1 className="text-2xl">{title}</h1>
                        <button
                            onClick={closeDialog}
                            className="mb-2 py-1 px-2 cursor-pointer rounded border-none w-8 h-8 font-bold text-white"
                        >x</button>
                    </div>
                    <div className="px-5 pb-6">
                        {children}
                        <div className="flex flex-row justify-end mt-2">
                          <Button onClick={clickOk}>
                              OK
                          </Button>
                        </div>
                    </div>
                </div>
            </dialog>
        ) : null

    return dialog
}
