import {
  currentTryAtom,
  guessWordAtom,
  lettersAtom,
  lettersWithSignaturesAtom,
  wordsAtom,
} from "@/atoms";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function InputRow({ index }: { index: number }): JSX.Element {
  const guessWord = useAtomValue(guessWordAtom);
  const [letters, setLetters] = useAtom(lettersAtom);
  const [currentTry, setCurrentTry] = useAtom(currentTryAtom);
  const [isEnabled, setIsEnabled] = useState(currentTry === index);
  const words = useAtomValue(wordsAtom);
  const [lettersWithSignatures, setLettersWithSignatures] = useAtom(
    lettersWithSignaturesAtom
  );

  function handleAddLetter(letter: string) {
    const emptyLetters = letters[index].filter((l) => l === "");
    if (emptyLetters.length === 0) return;
    setLetters((prev) => {
      const copy = [...prev];
      copy[index][5 - emptyLetters.length] = letter;
      return copy;
    });
  }

  function handleRemoveLetter() {
    const emptyLetters = letters[index].filter((l) => l === "");
    if (emptyLetters.length === 5) return;
    setLetters((prev) => {
      const copy = [...prev];
      copy[index][4 - emptyLetters.length] = "";
      return copy;
    });
  }

  function incrementTry() {
    if (
      currentTry >= 6 ||
      letters[index].filter((l) => l === "").length > 0 ||
      !isEnabled
    )
      return;

    const word = letters[index].join("");

    if (!words.includes(word)) {
      return;
    }

    if (word === guessWord) {
      setCurrentTry(69);
      setLettersWithSignatures(letters.map((l) => `GP-${l}`));
    } else {
      const lettersCopy = [...letters][index];
      letters[index].forEach((w, i) => {
        if (guessWord.includes(w)) {
          if (guessWord[i] === w) {
            lettersCopy[i] = `GP-${w}`;
          } else {
            lettersCopy[i] = `WP-${w}`;
          }
        } else {
          lettersCopy[i] = `NI-${w}`;
        }
      });

      setLettersWithSignatures([...lettersWithSignatures, ...lettersCopy]);
      setCurrentTry(currentTry + 1);
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
  }, [letters, isEnabled]);

  useEffect(() => {
    setIsEnabled(currentTry === index);
  }, [currentTry]);

  return (
    <>
      {letters[index].map((letter, i) => {
        return (
          <div
            key={`${currentTry}${i}`}
            className={`flex flex-col justify-center items-center rounded-lg text-xl w-full h-full border-2 uppercase transition-colors ${
              letter.startsWith("GP-")
                ? "bg-green-500 text-white"
                : letter.startsWith("WP-")
                ? "bg-yellow-500 text-white"
                : letter.startsWith("NI-")
                ? "dark:bg-gray-600 bg-gray-400"
                : isEnabled
                ? "border-gray-600"
                : ""
            }`}
          >
            {letter.length === 1 ? letter : letter.substring(3, 4)}
          </div>
        );
      })}
    </>
  );
}
