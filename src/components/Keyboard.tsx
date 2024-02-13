import { ArrowLeftCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import {
  currentTryAtom,
  guessWordAtom,
  lettersAtom,
  lettersWithSignaturesAtom,
  wordsAtom,
} from "@/atoms";
import { useAtom, useAtomValue } from "jotai";

export default function Keyboard(): JSX.Element {
  const [lettersWithSignatures, setLettersWithSignatures] = useAtom(
    lettersWithSignaturesAtom
  );
  const [currentTry, setCurrentTry] = useAtom(currentTryAtom);
  const [letters, setLetters] = useAtom(lettersAtom);
  const words = useAtomValue(wordsAtom);
  const guessWord = useAtomValue(guessWordAtom);

  const [goodPositioned, setGoodPositioned] = useState<string[]>([]);
  const [badPositioned, setBadPositioned] = useState<string[]>([]);
  const [notInWord, setNotInWord] = useState<string[]>([]);

  function handleAddLetter(letter: string) {
    const emptyLetters = letters[currentTry].filter((l) => l === "");
    if (emptyLetters.length === 0) return;
    const copy = [...letters];
    copy[currentTry][5 - emptyLetters.length] = letter.toLowerCase();
    setLetters(copy);
  }

  function handleRemoveLetter() {
    const emptyLetters = letters[currentTry].filter((l) => l === "");
    if (emptyLetters.length === 5) return;
    const copy = [...letters];
    copy[currentTry][4 - emptyLetters.length] = "";
    setLetters(copy);
  }

  function incrementTry() {
    if (
      currentTry >= 6 ||
      letters[currentTry].filter((l) => l === "").length > 0
    )
      return;

    const word = letters[currentTry].join("").toLowerCase();

    if (!words.includes(word)) {
      return;
    }

    if (word === guessWord) {
      setCurrentTry(69);
      setLettersWithSignatures([
        ...lettersWithSignatures,
        letters[currentTry].map((l) => `GP-${l}`).join(""),
      ]);
    } else {
      const lettersCopy = [...letters][currentTry];
      letters[currentTry].forEach((w, i) => {
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
    const good = lettersWithSignatures
      .filter((l) => l.substring(0, 2) === "GP")
      .flat();
    const bad = lettersWithSignatures
      .filter((l) => l.substring(0, 2) === "WP")
      .flat();
    const notIn = lettersWithSignatures
      .filter((l) => l.substring(0, 2) === "NI")
      .flat();

    setGoodPositioned(good);
    setBadPositioned(bad);
    setNotInWord(notIn);
  }, [lettersWithSignatures]);

  function letterClass(letter: string) {
    if (goodPositioned.includes(`GP-${letter}`)) {
      return "bg-green-500";
    } else if (badPositioned.includes(`WP-${letter}`)) {
      return "bg-yellow-500";
    } else if (notInWord.includes(`NI-${letter}`)) {
      return "dark:bg-gray-600 bg-gray-400";
    }
  }

  return (
    <div className="grid grid-cols-10 grid-rows-3 content-center gap-2">
      {Array.from({ length: 10 }).map((_, i) => (
        <Button
          key={i}
          variant="outline"
          className={`w-10 h-10 rounded-lg ${letterClass(
            String.fromCharCode(65 + i).toLowerCase()
          )}`}
          onClick={() => handleAddLetter(String.fromCharCode(65 + i))}
        >
          {String.fromCharCode(65 + i)}
        </Button>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <Button
          key={i}
          variant="outline"
          className={`w-10 h-10 rounded-lg ${letterClass(
            String.fromCharCode(75 + i).toLowerCase()
          )}`}
          onClick={() => handleAddLetter(String.fromCharCode(75 + i))}
        >
          {String.fromCharCode(75 + i)}
        </Button>
      ))}
      <Button
        variant="destructive"
        onClick={handleRemoveLetter}
        className="flex items-center justify-center col-span-2"
      >
        <ArrowLeftCircle />
      </Button>
      {Array.from({ length: 8 }).map((_, i) => (
        <Button
          key={i}
          variant="outline"
          className={`w-10 h-10 rounded-lg ${letterClass(
            String.fromCharCode(83 + i).toLowerCase()
          )}`}
          onClick={() => handleAddLetter(String.fromCharCode(83 + i))}
        >
          {String.fromCharCode(83 + i)}
        </Button>
      ))}
      <Button
        className="flex items-center justify-center col-span-2"
        onClick={incrementTry}
      >
        ENTER
      </Button>
    </div>
  );
}
