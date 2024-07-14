import { useEditable } from "@editablejs/editor";
import { Transforms } from "@editablejs/models";
import { FileUpload } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useRef } from "react";

export const OpenFile = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const editor = useEditable();

    return (
        <IconButton
            size='large'
            color='inherit'
            onClick={() => {
                fileRef.current?.click();
            }}
        >
            <input
                type="file"
                ref={fileRef}
                accept=".docx"
                style={{ display: 'none' }}
                onChange={async (event) => {
                    const fileObj = event.target.files && event.target.files[0];
                    if (!fileObj) {
                        return;
                    }

                    const reader = new FileReader();
                    reader.readAsArrayBuffer(fileObj);

                    reader.onload = function () {
                        Transforms.deselect(editor);
                        //@ts-expect-error
                        editor.loadDocx(this.result);
                    }
                }}
            />
            <FileUpload />
        </IconButton>
    )
}