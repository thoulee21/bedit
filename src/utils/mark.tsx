import { MarkFormat } from "@editablejs/plugins";
import {
    Code,
    FormatBold,
    FormatItalic,
    FormatStrikethrough,
    FormatUnderlined,
    Subscript,
    Superscript
} from "@mui/icons-material";

export interface Mark {
    name: MarkFormat;
    icon: any;
}

export const marks: Mark[] = [
    {
        name: 'bold',
        icon: <FormatBold />,
    },
    {
        name: 'italic',
        icon: <FormatItalic />,
    },
    {
        name: 'underline',
        icon: <FormatUnderlined />,
    },
    {
        name: 'strikethrough',
        icon: <FormatStrikethrough />,
    },
    {
        name: 'code',
        icon: <Code />,
    },
    {
        name: 'sub',
        icon: <Subscript />,
    },
    {
        name: 'sup',
        icon: <Superscript />,
    },
]