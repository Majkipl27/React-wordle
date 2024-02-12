import InputRow from "@/components/InputRow";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import words from "../assets/words.txt";
import { guessWordAtom, wordsAtom } from "@/atoms";
import { useAtom, useSetAtom } from "jotai";
import { Separator } from "@/components/ui/separator";

export default function Play(): JSX.Element {
  const [currentTry, setCurrentTry] = useState<number>(0);
  const setWords = useSetAtom(wordsAtom);
  const [guessWord, setGuessWord] = useAtom(guessWordAtom);

  useEffect(() => {
    async function fetchWords() {
      await fetch(words)
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
  }, []);

  useEffect(() => {
    if (currentTry === 6) {
      alert(`You lost! The word was ${guessWord}`);
      setCurrentTry(69);
    }
  }, [currentTry, guessWord]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      key="play"
      className="flex-1 flex flex-col justify-center items-center gap-4"
    >
      <h1 className="text-5xl tracking-tighter font-bold text-secondary-foreground">
        Wordle
      </h1>
      <Separator orientation="horizontal" className="w-1/4" />
      <div className="grid grid-cols-5 grid-rows-6 gap-2 w-1/4 h-2/3">
        {Array.from({ length: 6 }).map((_, i) => (
          <InputRow
            key={i}
            isEnabled={i === currentTry}
            setCurrentTry={setCurrentTry}
            currentTry={currentTry}
          />
        ))}
      </div>
    </motion.div>
  );
}
