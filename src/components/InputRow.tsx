import { guessWordAtom, wordsAtom } from "@/atoms";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

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
    if (
      currentTry >= 6 ||
      letters.filter((l) => l === "").length > 0 ||
      !isEnabled
    )
      return;

    const word = letters.join("");

    if (!words.includes(word)) {
      return;
    }

    if (word === guessWord) {
      alert(`You won! The word was indeed ${word}!`);
      setCurrentTry(69);
      setLettersWithSignatures(letters.map((l) => `GP-${l}`));
    } else {
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

  return (
    <>
      {letters.map((letter, i) => (
        <div
          key={`${currentTry}${i}`}
          className={`flex flex-col justify-center items-center rounded-lg text-xl w-full h-full border-2 uppercase transition-colors ${
            lettersWithSignatures[i] === `GP-${letter}`
              ? "border-green-500 bg-green-700 text-white"
              : lettersWithSignatures[i] === `WP-${letter}`
              ? "border-yellow-500 bg-yellow-700 text-white"
              : isEnabled
              ? "border-gray-600"
              : "border-border"
          }`}
        >
          {letter}
        </div>
      ))}
    </>
  );
}
