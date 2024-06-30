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
        icon: <FormatBold fontSize="small" />,
    },
    {
        name: 'italic',
        icon: <FormatItalic fontSize="small" />,
    },
    {
        name: 'underline',
        icon: <FormatUnderlined fontSize="small" />,
    },
    {
        name: 'strikethrough',
        icon: <FormatStrikethrough fontSize="small" />,
    },
    {
        name: 'code',
        icon: <Code fontSize="small" />,
    },
    {
        name: 'sub',
        icon: <Subscript fontSize="small" />,
    },
    {
        name: 'sup',
        icon: <Superscript fontSize="small" />,
    },
]