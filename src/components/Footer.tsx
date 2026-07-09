import { Button } from "@ui/button";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="minebox-shadow  w-full border-t bg-linear-to-b from-secondary-lighter to-secondary">
            <div className="grid grid-cols-3 gap-4 items-center justify-center py-2 px-4 hidden md:grid">
                <p className="text-xs">MIT License © 2026</p>
                <span className="text-xs flex flex-col justify-center items-center">
                    <span>Made with ❤️ for the Minebox community</span>
                    <span className="text-[0.5rem] text-muted-foreground ">Some illustrations are property of Qore Games and Minebox</span>

                </span>
                <span className="text-sm justify-self-end gap-1 flex">

                    <Link to="/contribute">
                        <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                            Contribute
                        </Button>
                    </Link>
                    <a href="https://ko-fi.com/6rius" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                            Support Us
                        </Button>
                    </a>
                </span>

            </div>

            <div className="grid grid-cols-1 gap-4 items-center justify-center py-2 px-4 grid md:hidden">
                <span className="text-xs flex flex-col justify-center items-center">
                    <span>Made with ❤️ for the Minebox community</span>
                    <span className="text-[0.5rem] text-muted-foreground ">Some illustrations are property of Qore Games and Minebox</span>

                </span>
                <span className="grid grid-cols-2 gap-4 items-center justify-center ">
                <p className="text-xs">MIT License © 2026</p>
                <span className="text-sm justify-self-end gap-1 flex">

                    <Link to="/contribute">
                        <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                            Contribute
                        </Button>
                    </Link>
                    <a href="https://ko-fi.com/6rius" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                            Support Us
                        </Button>
                    </a>
                </span>
                </span>

            </div>
        </footer>
    );
}