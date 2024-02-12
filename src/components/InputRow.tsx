import { guessWordAtom, wordsAtom } from "@/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InputRow({
  isEnabled,
  setCurrentTry,
  currentTry,
}: {
  isEnabled: boolean;
  setCurrentTry: React.Dispatch<React.SetStateAction<number>>;
  currentTry: number;
}): JSX.Element {
  const [letters, setLetters] = useState<string[]>(["", "", "", "", ""]);
  const [lettersWithSignatures, setLettersWithSignatures] = useState<string[]>(
    []
  );
  const guessWord = useAtomValue(guessWordAtom);
  const words = useAtomValue(wordsAtom);

  function handleAddLetter(letter: string) {
    const emptyLetters = letters.filter((l) => l === "");
    if (emptyLetters.length === 0) return;
    setLetters((prev) => {
      const copy = [...prev];
      copy[copy.length - emptyLetters.length] = letter;
      return copy;
    });
  }

  function handleRemoveLetter() {
    const emptyLetters = letters.filter((l) => l === "");
    if (emptyLetters.length === 5) return;
    setLetters((prev) => {
      const copy = [...prev];
      copy[copy.length - emptyLetters.length - 1] = "";
      return copy;
    });
  }

  function incrementTry() {
    if (!isEnabled) return;
    if (currentTry >= 6 || letters.filter((l) => l === "").length > 0) return;
    const word = letters.join("");
    if (words.includes(word)) {
      if (word === guessWord) {
        alert(`You won! The word was indeed ${guessWord.toUpperCase()}`);
        setCurrentTry(69);
        setLettersWithSignatures(letters.map((l) => `GP-${l}`));
        return;
      }
      const lettersCopy = [...letters];
      letters.forEach((w, i) => {
        if (guessWord.includes(w)) {
          if (guessWord[i] === w) {
            lettersCopy[i] = `GP-${w}`;
          } else {
            lettersCopy[i] = `WP-${w}`;
          }
        }
      });
      setLettersWithSignatures(lettersCopy);
      setCurrentTry(currentTry + 1);
    } else {
      toast.error(`${word.toUpperCase()} is not a valid word!`);
    }
  }

  useEffect(() => {
    if (!isEnabled) return;

    function handleInput(e: KeyboardEvent) {
      if (e.key === "Backspace") {
        handleRemoveLetter();
      } else if (e.key.match(/[a-z]/) && e.key.length === 1) {
        handleAddLetter(e.key);
      }
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        incrementTry();
      }
    });

    window.addEventListener("keydown", handleInput);

    return () => {
      window.removeEventListener("keydown", handleInput);
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          incrementTry();
        }
      });
    };
  }, [letters, isEnabled, currentTry]);

  return (
    <>
      {letters.map((letter, i) => (
        <div
          key={Math.random()}
          className={`flex flex-col justify-center items-center rounded-lg text-xl w-full h-full border-2 uppercase ${
            lettersWithSignatures[i] === `GP-${letter}`
              ? "border-green-500"
              : lettersWithSignatures[i] === `WP-${letter}`
              ? "border-yellow-500"
              : "border-border"
          }`}
        >
          {letter}
        </div>
      ))}
    </>
  );
}
