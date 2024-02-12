import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="flex-1 flex flex-col justify-center items-center"
      key="landingPage"
    >
      <h1 className="text-8xl tracking-tighter font-bold text-secondary-foreground">
        Wordle
      </h1>
      <p className="text-xl tracking-tight font-semibold text-primary mb-32">
        Wordle clone in react
      </p>
      <span className="flex items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-32">
              How to play?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>How to play?</DialogTitle>
              <DialogDescription>
                Quick walkthrough on how to play the game
              </DialogDescription>
            </DialogHeader>
            <span className="mx-2">
              I can't be bothered to write this, go to{" "}
              <a
                href="https://www.nytimes.com/games/wordle/index.html"
                className="hover:text-primary hover:no-underline text w-fit underline"
                target="blank"
              >
                Wordle
              </a>{" "}
              and read it there :D
            </span>
          </DialogContent>
        </Dialog>
        <Link
          to="/play"
          className={buttonVariants({ variant: "default" }) + " w-32"}
        >
          Play
        </Link>
      </span>
    </motion.div>
  );
}
