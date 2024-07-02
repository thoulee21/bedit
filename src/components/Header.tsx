import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Image from 'next/image';
import Link from 'next/link';
import { OpenFile } from "./OpenFile";
import { SaveFile } from "./SaveFile";

export const Header = () => {
    return (
        <AppBar position="static" color="info">
            <Toolbar>
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
                    Bedit - An AI-powered rich text editor
                </Typography>

                <OpenFile />
                <SaveFile />
            </Toolbar>
        </AppBar>
    )
}