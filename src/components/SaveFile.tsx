import { useEditable } from "@editablejs/editor";
import { Save } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import saveAs from "file-saver";

export const SaveFile = () => {
    const editor = useEditable();

    const handleClick = () => {
        //@ts-expect-error
        const buffer = editor.saveDocx();
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, `demo.docx`);
    };

    return (
        <IconButton
            size='large'
            edge='end'
            color='inherit'
            aria-label='download'
            onClick={handleClick}
        >
            <Save />
        </IconButton>
    );
};
