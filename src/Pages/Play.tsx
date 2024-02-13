import InputRow from "@/components/InputRow";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  currentTryAtom,
  guessWordAtom,
  lettersAtom,
  lettersWithSignaturesAtom,
  wordsAtom,
} from "@/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Separator } from "@/components/ui/separator";
import Keyboard from "@/components/Keyboard";
import wordsPath from "../assets/words.txt";
import { Button } from "@/components/ui/button";

export default function Play(): JSX.Element {
  const [currentTry, setCurrentTry] = useAtom(currentTryAtom);
  const guessWord = useAtomValue(guessWordAtom);
  const setWords = useSetAtom(wordsAtom);
  const setGuessWord = useSetAtom(guessWordAtom);
  const [hasGameEnded, setHasGameEnded] = useState<boolean>(false);
  const setLetters = useSetAtom(lettersAtom);
  const setLettersWithSignatures = useSetAtom(lettersWithSignaturesAtom);

  useEffect(() => {
    async function fetchWords() {
      await fetch(wordsPath)
        .then((response) => response.text())
        .then((result) => {
          const words = result.split("\n");
          words.pop();
          const randomIndex = Math.floor(Math.random() * words.length);
          setGuessWord(words[randomIndex]);
          setWords(words);
        });
    }

    fetchWords();

    setCurrentTry(0);
    setLetters([
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
    setLettersWithSignatures([]);
  }, []);

  useEffect(() => {
    if (currentTry === 6) {
      alert(`You lost! The word was ${guessWord}.`);
      setHasGameEnded(true);
    } else if (currentTry === 69) {
      alert(`You won! The word was indeed ${guessWord}!`);
      setHasGameEnded(true);
    }
  }, [currentTry]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      key="play"
      className="flex-1 flex flex-col justify-center items-center gap-4 overflow-y-auto py-8"
    >
      <h1 className="text-5xl tracking-tighter font-bold text-secondary-foreground">
        Wordle
      </h1>
      {hasGameEnded ? (
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <p>The game has ended. Click the button bellow to play again!</p>
          <Button onClick={() => window.location.reload()}>Play again</Button>
        </div>
      ) : (
        <>
          <Separator
            orientation="horizontal"
            className="xl:w-1/4 sm:w-2/3 w-full px-4"
          />
          <div className="grid grid-cols-5 grid-rows-6 gap-2 xl:w-1/4 sm:w-2/3 w-full px-4 xl:h-2/3 h-2/3">
            {Array.from({ length: 6 }).map((_, i) => (
              <InputRow key={i} index={i} />
            ))}
          </div>
          <Separator
            orientation="horizontal"
            className="xl:w-1/4 sm:w-2/3 w-full"
          />
          <Keyboard />
        </>
      )}
    </motion.div>
  );
}
