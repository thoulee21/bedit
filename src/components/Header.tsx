import { usePreferences } from "@/app/PreferenceProvider";
import {
    AppBar,
    Divider,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import packageInfo from '../../package.json';
import { MaterialUISwitch } from "./MaterialUISwitch";
import { OpenFile } from "./OpenFile";
import { SaveFile } from "./SaveFile";

const DarkModeSwitch = () => {
    const { prefersDarkMode, setPrefersDarkMode } = usePreferences();
    return (
        <MaterialUISwitch
            checked={prefersDarkMode}
            edge='end'
            onChange={() => setPrefersDarkMode(!prefersDarkMode)}
            color="primary"
        />
    )
}

export const Header = () => {
    return (
        <AppBar>
            <Toolbar variant="dense">
                <Link href="/next">
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <Image src="/favicon.ico" alt='logo' width={30} height={30} />
                    </IconButton>
                </Link>

                <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/">
                        Bedit v{packageInfo.version}
                    </Link>
                </Typography>

                <OpenFile />
                <SaveFile />

                <DarkModeSwitch />
            </Toolbar>
        </AppBar>
    )
}