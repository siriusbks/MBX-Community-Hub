import { Button } from "@ui/button";

export const Footer = () => {
    return (
        <footer className="minebox-shadow  w-full border-t bg-linear-to-b from-secondary-lighter to-secondary">
            <div className="grid grid-cols-3 gap-4 items-center justify-center py-2 px-4">
                <p className="text-xs">MIT License © 2026</p>
                <span className="text-xs flex flex-col justify-center items-center">
                    <span>Made with  for the Minebox community</span>
                    <span className="text-[0.5rem] text-muted-foreground ">Some illustrations are property of Qore Games and Minebox</span>

                </span>
                <span className="text-sm justify-self-end gap-1 flex">
                    
                    <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                        Contribute
                    </Button>
                    <Button variant="secondary" size="sm" className="font-normal px-2 py-1">
                        Support Us
                    </Button>
                </span>

            </div>
        </footer>
    );
}