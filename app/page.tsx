"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GameId = "jungle" | "temple" | "pirate";
type Game = { id: GameId; number: string; title: string; subtitle: string; image: string; accent: string; icon: string; how: string };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const games: Game[] = [
  { id: "jungle", number: "I", title: "English Word Hunt", subtitle: "Find themed English words across six growing letter fields.", image: `${basePath}/jungle-quest.png`, accent: "#42f5df", icon: "🔤", how: "Click adjacent letters to spell every word in the list. Each level has a new theme and a larger field. Click the selected letter again to undo. Clear all six levels to collect every prize and the green map piece." },
  { id: "temple", number: "II", title: "Temple Grammar Trials", subtitle: "Listen, race the clock and solve increasingly difficult grammar puzzles.", image: `${basePath}/temple-trials.png`, accent: "#ffc94b", icon: "🏛️", how: "Complete six timed grammar trials with three lives. Listen to every sentence, choose the missing words and open all six temple doors to reveal the golden map piece." },
  { id: "pirate", number: "III", title: "Pirate Island Mystery", subtitle: "Listen carefully and find eight hidden objects inside one mysterious island scene.", image: `${basePath}/pirate-island.png`, accent: "#4de8ff", icon: "⚓", how: "Play the English audio mission, then search the large pirate island picture and click the named object. Find all eight hidden treasures. You may replay each clue three times, but wrong clicks cost one of your five lives." },
];

const jungleRounds = [
  { prompt: "Find all the FOOD", seconds: 22, options: ["🍎 Apple", "🐯 Tiger", "🥪 Sandwich", "🪑 Chair", "🍌 Banana", "🚲 Bicycle"], correct: ["🍎 Apple", "🥪 Sandwich", "🍌 Banana"] },
  { prompt: "Find all the ANIMALS", seconds: 20, options: ["🐒 Monkey", "👕 Shirt", "🐘 Elephant", "📚 Books", "🦜 Parrot", "🛴 Scooter", "🐬 Dolphin"], correct: ["🐒 Monkey", "🐘 Elephant", "🦜 Parrot", "🐬 Dolphin"] },
  { prompt: "Find all the SCHOOL OBJECTS", seconds: 18, options: ["✏️ Pencil", "🌧️ Rain", "📓 Notebook", "⚽ Football", "🎒 Backpack", "🐟 Fish", "📏 Ruler", "🚌 Bus"], correct: ["✏️ Pencil", "📓 Notebook", "🎒 Backpack", "📏 Ruler"] },
  { prompt: "Find all the CLOTHES", seconds: 16, options: ["🧥 Jacket", "🛏️ Bed", "👟 Shoes", "🍰 Cake", "🧢 Cap", "🚂 Train", "🧦 Socks", "🧣 Scarf", "🪑 Chair"], correct: ["🧥 Jacket", "👟 Shoes", "🧢 Cap", "🧦 Socks", "🧣 Scarf"] },
  { prompt: "Find all the TRANSPORT", seconds: 14, options: ["🚌 Bus", "🦁 Lion", "✈️ Plane", "🧦 Socks", "🚲 Bicycle", "🥕 Carrot", "🚂 Train", "🛴 Scooter", "⛵ Ship", "🛣️ Road"], correct: ["🚌 Bus", "✈️ Plane", "🚲 Bicycle", "🚂 Train", "🛴 Scooter", "⛵ Ship"] },
  { prompt: "FINAL MIXED CHALLENGE", seconds: 30, options: ["🍎 Apple", "🐒 Monkey", "✏️ Pencil", "🧥 Jacket", "🚌 Bus", "🍌 Banana", "🦜 Parrot", "🎒 Backpack", "👟 Shoes", "✈️ Plane", "🪑 Chair", "🍰 Cake"], correct: [] },
];

const jungleFinalStages = [
  { prompt: "First: find all the FOOD", correct: ["🍎 Apple", "🍌 Banana", "🍰 Cake"] },
  { prompt: "Next: find all the ANIMALS", correct: ["🐒 Monkey", "🦜 Parrot"] },
  { prompt: "Finally: find all the SCHOOL OBJECTS", correct: ["✏️ Pencil", "🎒 Backpack"] },
];
type WordPicture = { id: string; label: string; letter: string; atlas: "a" | "b"; position: string };
const wordPictures: Record<string, WordPicture> = {
  lion: { id: "lion", label: "Lion", letter: "L", atlas: "a", position: "0% 0%" },
  lamp: { id: "lamp", label: "Lamp", letter: "L", atlas: "a", position: "50% 0%" },
  icecream: { id: "icecream", label: "Ice cream", letter: "I", atlas: "a", position: "100% 0%" },
  owl: { id: "owl", label: "Owl", letter: "O", atlas: "a", position: "0% 50%" },
  nest: { id: "nest", label: "Nest", letter: "N", atlas: "a", position: "50% 50%" },
  apple: { id: "apple", label: "Apple", letter: "A", atlas: "a", position: "100% 50%" },
  bus: { id: "bus", label: "Bus", letter: "B", atlas: "a", position: "0% 100%" },
  frogA: { id: "frogA", label: "Frog", letter: "F", atlas: "a", position: "50% 100%" },
  key: { id: "key", label: "Key", letter: "K", atlas: "a", position: "100% 100%" },
  rabbit: { id: "rabbit", label: "Rabbit", letter: "R", atlas: "b", position: "0% 0%" },
  gift: { id: "gift", label: "Gift", letter: "G", atlas: "b", position: "33.333% 0%" },
  tiger: { id: "tiger", label: "Tiger", letter: "T", atlas: "b", position: "66.666% 0%" },
  elephant: { id: "elephant", label: "Elephant", letter: "E", atlas: "b", position: "100% 0%" },
  panda: { id: "panda", label: "Panda", letter: "P", atlas: "b", position: "0% 50%" },
  pizza: { id: "pizza", label: "Pizza", letter: "P", atlas: "b", position: "33.333% 50%" },
  hat: { id: "hat", label: "Hat", letter: "H", atlas: "b", position: "66.666% 50%" },
  umbrella: { id: "umbrella", label: "Umbrella", letter: "U", atlas: "b", position: "100% 50%" },
  sun: { id: "sun", label: "Sun", letter: "S", atlas: "b", position: "0% 100%" },
  train: { id: "train", label: "Train", letter: "T", atlas: "b", position: "33.333% 100%" },
  house: { id: "house", label: "House", letter: "H", atlas: "b", position: "66.666% 100%" },
  frog: { id: "frog", label: "Frog", letter: "F", atlas: "b", position: "100% 100%" },
};
type FillwordLevel = { size: number; theme: string; icon: string; words: string[]; reward: string };
const jungleWordLevels: FillwordLevel[] = [
  { size: 3, theme: "Farm Animals", icon: "🐾", words: ["CAT", "DOG", "HEN"], reward: "Bronze Paw Badge" },
  { size: 4, theme: "Wild Animals", icon: "🦁", words: ["LION", "BEAR", "FROG", "DUCK"], reward: "50 Explorer Coins" },
  { size: 5, theme: "Fruit", icon: "🍎", words: ["APPLE", "GRAPE", "LEMON", "PEACH", "MELON"], reward: "Golden Apple Trophy" },
  { size: 6, theme: "Space", icon: "🪐", words: ["EARTH", "MARS", "VENUS", "SATURN", "NEPTUNE", "URANUS", "SUN"], reward: "Star Explorer Badge" },
  { size: 7, theme: "School", icon: "🎒", words: ["PENCIL", "RULER", "BOOK", "ERASER", "SCHOOL", "TEACHER", "LESSON", "MAP", "PEN", "BAG"], reward: "100 Explorer Coins" },
  { size: 8, theme: "Nature", icon: "🌿", words: ["RIVER", "OCEAN", "FOREST", "JUNGLE", "FLOWER", "MOUNTAIN", "RAIN", "CLOUD", "STORM", "THUNDER", "SUN", "TREE"], reward: "Legendary Jungle Crown" },
];

function makeFillword(level: FillwordLevel) {
  const letters = level.words.join("").split("");
  const grid = Array.from({ length: level.size }, () => Array(level.size).fill(""));
  const path = makeFillwordPath(level);
  path.forEach((cell, index) => { grid[Math.floor(cell / level.size)][cell % level.size] = letters[index]; });
  return grid.flat();
}

function makeFillwordPath(level: FillwordLevel) {
  const windingPaths: Record<number, number[]> = {
    3: [0, 1, 4, 3, 6, 7, 8, 5, 2],
    4: [0, 1, 2, 6, 5, 4, 8, 12, 13, 9, 10, 14, 15, 11, 7, 3],
    5: [0, 1, 2, 3, 8, 7, 6, 5, 10, 11, 12, 13, 18, 17, 16, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4],
    6: [0, 1, 2, 3, 9, 8, 7, 6, 12, 13, 14, 15, 16, 10, 4, 5, 11, 17, 23, 29, 35, 34, 33, 32, 31, 30, 24, 18, 19, 25, 26, 20, 21, 22, 28, 27],
    7: [0, 1, 2, 3, 4, 11, 10, 9, 8, 7, 14, 15, 16, 17, 24, 23, 22, 21, 28, 29, 30, 31, 32, 25, 18, 19, 12, 5, 6, 13, 20, 27, 26, 33, 34, 41, 48, 47, 40, 39, 46, 45, 38, 37, 44, 43, 42, 35, 36],
    8: [0, 1, 2, 3, 11, 10, 9, 8, 16, 17, 18, 19, 20, 12, 4, 5, 6, 7, 15, 23, 31, 39, 47, 55, 63, 62, 61, 60, 59, 58, 57, 56, 48, 49, 50, 51, 52, 53, 54, 46, 45, 44, 43, 42, 34, 35, 36, 37, 38, 30, 22, 14, 13, 21, 29, 28, 27, 26, 25, 33, 41, 40, 32, 24],
  };
  return windingPaths[level.size];
}
const templeRounds = [
  { prompt: "Tom plays football every Saturday.", clue: "Tom  •  football  •  every Saturday", seconds: 38, words: ["Tom", "plays", "football", "every Saturday"], distractors: ["play", "is playing", "yesterday"], topic: "PRESENT SIMPLE" },
  { prompt: "There are two parrots in the ancient tree.", clue: "two parrots  •  ancient tree", seconds: 38, words: ["There", "are", "two parrots", "in the ancient tree"], distractors: ["is", "was", "be"], topic: "THERE IS / ARE" },
  { prompt: "The explorers opened the first door yesterday.", clue: "explorers  •  first door  •  yesterday", seconds: 36, words: ["The explorers", "opened", "the first door", "yesterday"], distractors: ["open", "opens", "are opening"], topic: "PAST SIMPLE" },
  { prompt: "The guardian is running across the bridge now.", clue: "guardian  •  bridge  •  now", seconds: 34, words: ["The guardian", "is running", "across the bridge", "now"], distractors: ["runs", "ran", "running"], topic: "PRESENT CONTINUOUS" },
  { prompt: "Mia could not enter the chamber.", clue: "Mia  •  locked chamber  •  past", seconds: 32, words: ["Mia", "could not", "enter", "the chamber"], distractors: ["can not", "does not", "entered"], topic: "MODAL VERBS" },
  { prompt: "If we find the key, we will open the treasure room.", clue: "find the key  ➜  open the treasure room", seconds: 40, words: ["If we find", "the key", "we will open", "the treasure room"], distractors: ["we opened", "we open", "we are opening"], topic: "FIRST CONDITIONAL" },
];
const pirateRounds = [
  { prompt: "Find the place with a tall brown trunk, no branches near the ground, and green leaves at the top.", seconds: 22, options: ["🌴 Palm tree", "🌳 Jungle tree", "🗼 Lighthouse", "🪨 Rocks"], answer: "🌴 Palm tree" },
  { prompt: "Find the structure explorers use to cross the river without getting their boots wet.", seconds: 20, options: ["🌉 Bridge", "⛵ Ship", "🛶 Boat", "💧 Waterfall"], answer: "🌉 Bridge" },
  { prompt: "Find the tall coastal tower whose rotating light warns sailors about danger at night.", seconds: 18, options: ["🗼 Lighthouse", "🏰 Watchtower", "⛵ Ship", "🏚️ Old house", "🪨 Rocks"], answer: "🗼 Lighthouse" },
  { prompt: "Find the dark natural shelter hidden inside the rocky hill, not the building beside it.", seconds: 17, options: ["🕳️ Cave", "🏚️ Old house", "⛺ Camp", "🪨 Rocks", "🌋 Crater"], answer: "🕳️ Cave" },
  { prompt: "Follow the sound of water dropping over a high cliff into a pool below.", seconds: 15, options: ["💧 Waterfall", "🌊 River", "🏝️ Lagoon", "🌊 Shore", "🌉 Bridge", "🕳️ Cave"], answer: "💧 Waterfall" },
  { prompt: "Choose the large sailing vessel anchored beyond the reef, not the smaller boat near the beach.", seconds: 14, options: ["⛵ Ship", "🛶 Boat", "🏴‍☠️ Raft", "🗼 Lighthouse", "🏝️ Island", "⚓ Harbour"], answer: "⛵ Ship" },
];
const hiddenItems = [
  { id: "compass", label: "Compass", clue: "Find the brass compass.", seconds: 42, x: 11.5, y: 19.5, w: 10, h: 14 },
  { id: "key", label: "Red key", clue: "Find the red key hanging from a vine.", seconds: 40, x: 43.7, y: 15.5, w: 7, h: 18 },
  { id: "spyglass", label: "Spyglass", clue: "Find the brass spyglass on the rocks.", seconds: 38, x: 90.5, y: 19.5, w: 13, h: 10 },
  { id: "bottle", label: "Green bottle", clue: "Find the green bottle in the sand.", seconds: 36, x: 22.5, y: 86, w: 10, h: 15 },
  { id: "coin", label: "Golden coin", clue: "Find the golden coin beside the treasure chest.", seconds: 34, x: 52.5, y: 77.5, w: 8, h: 12 },
  { id: "feather", label: "Blue feather", clue: "Find the blue feather hidden in the leaves.", seconds: 32, x: 23.5, y: 49, w: 8, h: 15 },
  { id: "shell", label: "Pink seashell", clue: "Find the pink seashell on the beach.", seconds: 30, x: 74.5, y: 88, w: 13, h: 11 },
  { id: "anchor", label: "Anchor", clue: "Find the dark iron anchor near the rocks.", seconds: 30, x: 81, y: 58, w: 11, h: 19 },
];

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function Home() {
  const [completed, setCompleted] = useState<GameId[]>([]);
  const [active, setActive] = useState<GameId | null>(null);
  const [how, setHow] = useState<Game | null>(null);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [revealedClue, setRevealedClue] = useState("");
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [jungleStage, setJungleStage] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaysLeft, setAudioPlaysLeft] = useState(2);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [levelReward, setLevelReward] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem("english-adventure-progress");
    sessionStorage.removeItem("english-adventure-show-map");
  }, []);

  const game = useMemo(() => games.find((item) => item.id === active), [active]);
  const jungleLevel = jungleWordLevels[Math.min(round, jungleWordLevels.length - 1)];
  const jungleGrid = useMemo(() => makeFillword(jungleLevel), [jungleLevel]);
  const jungleWordBank = useMemo(() => shuffled(jungleLevel.words), [jungleLevel]);

  useEffect(() => {
    if ((active !== "temple" && active !== "pirate") || (active === "pirate" && !audioPlayed) || gameOver || message.includes("Map piece found")) return;
    const timer = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active, audioPlayed, gameOver, message, round]);

  useEffect(() => {
    if ((active !== "temple" && active !== "pirate") || (active === "pirate" && !audioPlayed) || gameOver || timeLeft !== 0 || message.includes("Map piece found")) return;
    const timeout = window.setTimeout(() => {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (active !== "pirate") setPicked([]);
      if (nextLives <= 0) {
        setGameOver(true);
        setMessage(active === "temple" ? "Time is up. The temple doors are sealed!" : "Time is up. The treasure trail is lost!");
      } else {
        setMessage("Time is up — one life lost. Try this trial again!");
        setTimeLeft(active === "temple" ? templeRounds[round].seconds : hiddenItems[round].seconds);
        window.setTimeout(() => setMessage(""), 1200);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [active, audioPlayed, gameOver, lives, message, round, timeLeft]);

  function getOptions(id: GameId, index: number) {
    const source = id === "jungle" ? jungleRounds[index].options : id === "temple" ? [...templeRounds[index].words, ...templeRounds[index].distractors] : pirateRounds[index].options;
    return shuffled(source);
  }
  function openGame(id: GameId) { setActive(id); setRound(0); setPicked([]); setFoundWords([]); setLevelReward(null); setMessage(""); setRevealedClue(""); setLives(id === "pirate" ? 5 : 3); setJungleStage(0); setGameOver(false); setAudioPlayed(false); setAudioPlaysLeft(id === "pirate" ? 3 : 2); setTimeLeft(id === "temple" ? templeRounds[0].seconds : id === "pirate" ? hiddenItems[0].seconds : 0); setOptions(getOptions(id, 0)); }
  function closeGame() { setActive(null); setRound(0); setPicked([]); setMessage(""); setRevealedClue(""); }
  function returnToMap() {
    closeGame();
    window.setTimeout(() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }
  function finish(id: GameId) {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next);
    setMessage("Map piece found! ✦");
  }
  function advance(id: GameId) {
    if (round === 5) finish(id); else {
      const nextRound = round + 1;
      setRound(nextRound); setPicked([]); setRevealedClue(""); setJungleStage(0); setAudioPlayed(false); setAudioPlaysLeft(2); setOptions(getOptions(id, nextRound));
      if (id === "jungle") setTimeLeft(jungleRounds[nextRound].seconds);
      if (id === "temple") setTimeLeft(templeRounds[nextRound].seconds);
      if (id === "pirate") setTimeLeft(pirateRounds[nextRound].seconds);
      setMessage("Correct! The path opens…"); setTimeout(() => setMessage(""), 900);
    }
  }
  function playTone(frequency = 520, duration = 0.1) {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine"; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration);
    window.setTimeout(() => void context.close(), duration * 1000 + 80);
  }
  function chooseJungle(cellIndex: number) {
    if (gameOver || foundWords.length === jungleLevel.words.length || levelReward) return;
    playTone(440 + (jungleGrid[cellIndex].charCodeAt(0) - 65) * 18);
    const id = String(cellIndex);
    if (picked[picked.length - 1] === id) { setPicked(picked.slice(0, -1)); setMessage("One letter removed."); return; }
    if (picked.length) {
      const previous = Number(picked[picked.length - 1]);
      const rowDistance = Math.abs(Math.floor(previous / jungleLevel.size) - Math.floor(cellIndex / jungleLevel.size));
      const columnDistance = Math.abs(previous % jungleLevel.size - cellIndex % jungleLevel.size);
      if (rowDistance + columnDistance !== 1) {
        setMessage("No diagonal moves — choose a tile directly above, below, left or right.");
        playTone(180, 0.16);
        return;
      }
    }
    const snake = makeFillwordPath(jungleLevel);
    let offset = 0;
    const segments = jungleLevel.words.map((word) => { const cells = snake.slice(offset, offset + word.length); offset += word.length; return { word, cells }; });
    const activeSegment = picked.length ? segments.find(({ cells }) => cells[0] === Number(picked[0])) : segments.find(({ word, cells }) => !foundWords.includes(word) && cells[0] === cellIndex);
    if (!activeSegment || activeSegment.cells[picked.length] !== cellIndex) {
      setPicked([]); setMessage("Start at the first letter of a word and follow touching tiles."); return;
    }
    const next = [...picked, id];
    setPicked(next);
    if (next.length === activeSegment.word.length) {
      const newlyFound = [...foundWords, activeSegment.word];
      setFoundWords(newlyFound); setPicked([]); setMessage(`${activeSegment.word} found!`); playTone(880, 0.22);
      if (newlyFound.length === jungleLevel.words.length) {
        playTempleVictory();
        window.setTimeout(() => setLevelReward(jungleLevel.reward), 450);
      }
    } else setMessage(next.map((cell) => jungleGrid[Number(cell)]).join(""));
  }
  function nextJungleLevel() {
    setLevelReward(null); setPicked([]); setFoundWords([]); setMessage("");
    if (round === jungleWordLevels.length - 1) finish("jungle");
    else setRound((current) => current + 1);
  }
  function chooseTempleWord(word: string) {
    const data = templeRounds[round];
    if (picked.includes(word) || gameOver) return;
    const expected = data.words[picked.length];
    if (word === expected) {
      const next = [...picked, word];
      setPicked(next);
      setMessage(next.length === data.words.length ? "Spell complete — the altar is awakening!" : `The sphere “${word}” is locked in place.`);
      if (next.length === data.words.length) {
        playTempleVictory();
        setTimeout(() => advance("temple"), 1200);
      }
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "The spell collapsed. The temple doors are sealed!" : `Unstable sphere! You need “${expected}” next — one life lost.`);
      if (nextLives <= 0) setGameOver(true);
    }
  }
  function playTempleVictory() {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.025);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.1);
    master.connect(context.destination);
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      const start = context.currentTime + index * 0.16;
      oscillator.type = index === 3 ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      noteGain.gain.setValueAtTime(0.0001, start);
      noteGain.gain.exponentialRampToValueAtTime(0.65, start + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42);
      oscillator.connect(noteGain); noteGain.connect(master);
      oscillator.start(start); oscillator.stop(start + 0.45);
    });
    window.setTimeout(() => void context.close(), 1400);
  }
  function chooseAnswer(option: string, id: "pirate") {
    const data = pirateRounds[round];
    if (option === data.answer) {
      setRevealedClue(data.prompt); setMessage("Correct! The clue is revealed below."); setTimeout(() => advance(id), 1450);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "No lives left. The treasure trail is lost!" : "The compass points elsewhere — one life lost!");
      if (nextLives <= 0) setGameOver(true);
    }
  }
  function loseHiddenLife() {
    if (!audioPlayed || gameOver) return;
    const nextLives = lives - 1;
    setLives(nextLives);
    setMessage(nextLives <= 0 ? "The island mystery remains unsolved!" : "Nothing is hidden there — one life lost!");
    if (nextLives <= 0) setGameOver(true);
  }
  function chooseHiddenItem(itemId: string) {
    if (!audioPlayed || gameOver || picked.includes(itemId)) return;
    const target = hiddenItems[round];
    if (itemId !== target.id) { loseHiddenLife(); return; }
    const found = [...picked, itemId];
    setPicked(found);
    setMessage(`You found the ${target.label}!`);
    setAudioPlayed(false);
    if (round === hiddenItems.length - 1) setTimeout(() => finish("pirate"), 900);
    else {
      const nextRound = round + 1;
      setRound(nextRound);
      setAudioPlaysLeft(3);
      setTimeLeft(hiddenItems[nextRound].seconds);
      window.setTimeout(() => setMessage("Play the next audio mission."), 850);
    }
  }
  function speak() {
    if (!("speechSynthesis" in window)) { setMessage("Audio is not supported in this browser."); return; }
    if (audioPlaysLeft <= 0) { setMessage("No audio replays left — trust your memory!"); return; }
    setAudioPlayed(true); setAudioPlaysLeft((count) => count - 1); setMessage("");
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(hiddenItems[round].clue); utterance.lang = "en-US"; utterance.rate = 0.82; speechSynthesis.speak(utterance);
  }
  function speakTemple() {
    if (!("speechSynthesis" in window)) { setMessage("Audio is not supported in this browser."); return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(templeRounds[round].prompt); utterance.lang = "en-US"; utterance.rate = 0.82;
    speechSynthesis.speak(utterance);
  }

  return (
    <main className="adventure-shell" style={{ "--map-image": `url(${basePath}/lost-map-v2.png)` } as React.CSSProperties}>
      <div className="stars" aria-hidden="true" />
      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="English Adventure home"><span>✦</span> EA</a>
        <nav aria-label="Main navigation"><a href="#games">Games</a><a href="#journey">Journey</a><button onClick={() => setHow(games[0])}>How to play</button></nav>
        <div className="map-counter"><span>🧩</span><div><small>MAP PIECES</small><b>{completed.length} / 3</b></div></div>
      </header>

      <section className="hero" id="top">
        <p className="eyebrow"><span /> A LEARNING EXPEDITION <span /></p>
        <h1>ENGLISH <em>ADVENTURE</em></h1>
        <div className="ribbon">THE LOST MAP</div>
        <p className="hero-copy">Three challenges. Three lost pieces. One legendary journey through English.</p>
        <a className="scroll-cue" href="#games">Choose your adventure <b>↓</b></a>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading"><span>THE LOST LANDS</span><h2>Choose Your Adventure</h2><p>Complete every challenge to restore the explorer&apos;s map.</p></div>
        <div className="cards">
          {games.map((item) => (
            <article className={`game-card ${completed.includes(item.id) ? "is-complete" : ""}`} style={{ "--accent": item.accent } as React.CSSProperties} key={item.id}>
              <div className="card-number">{item.number}</div>
              <div className="card-image"><Image src={item.image} alt={`${item.title} adventure scene`} fill sizes="(max-width: 900px) 90vw, 31vw" priority /><div className="image-shade" /><span className="card-icon">{completed.includes(item.id) ? "✓" : item.icon}</span></div>
              <div className="card-body"><p className="chapter">CHAPTER {item.number}</p><h3>{item.title}</h3><p>{item.subtitle}</p><button className="play-button" onClick={() => openGame(item.id)}>{completed.includes(item.id) ? "PLAY AGAIN" : "PLAY NOW"}<span>›</span></button><button className="how-button" onClick={() => setHow(item)}>ⓘ &nbsp; HOW TO PLAY</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="journey" id="journey">
        <div className="map-orb">🧭</div><div><small>YOUR JOURNEY</small><h2>{completed.length === 3 ? "The Lost Map Is Complete!" : "Restore the Lost Map"}</h2><p>{completed.length === 3 ? "Congratulations, English Explorer! The treasure is yours." : "Each completed adventure reveals one piece of the ancient map."}</p></div>
        <div className={`map-puzzle ${completed.length === 3 ? "assembled" : ""}`} aria-label={`${completed.length} of 3 map pieces collected`}>
          <span className={`map-piece piece-one ${completed.includes("jungle") ? "found" : ""}`} aria-label="Jungle map fragment" />
          <span className={`map-piece piece-two ${completed.includes("temple") ? "found" : ""}`} aria-label="Temple map fragment" />
          <span className={`map-piece piece-three ${completed.includes("pirate") ? "found" : ""}`} aria-label="Pirate island map fragment" />
        </div>
      </section>

      <footer><span>✦</span><p>Learn • Explore • Discover</p><span>✦</span></footer>

      {how && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`How to play ${how.title}`}><div className="info-modal"><button className="close" onClick={() => setHow(null)} aria-label="Close">×</button><span className="modal-icon">{how.icon}</span><p className="chapter">FIELD GUIDE</p><h2>{how.title}</h2><p>{how.how}</p><button className="play-button" onClick={() => { setHow(null); openGame(how.id); }}>START ADVENTURE <span>›</span></button></div></div>}

      {active && game && <div className="modal-backdrop game-backdrop" role="dialog" aria-modal="true" aria-label={game.title}>
        <div className={`game-modal ${active}`}>
          <div className="game-banner"><Image src={game.image} alt="" fill sizes="800px" /><div /><button className="close" onClick={closeGame} aria-label="Close game">×</button><p>CHAPTER {game.number} · {active === "jungle" ? `LEVEL ${round + 1} / ${jungleWordLevels.length}` : active === "pirate" ? `OBJECT ${round + 1} / ${hiddenItems.length}` : `TRIAL ${Math.min(round + 1, 6)} / 6`}</p><h2>{game.title}</h2></div>
          <div className="game-content">
            {message === "Map piece found! ✦" ? <div className="victory"><div className={`earned-fragment ${active}`} aria-label={`${active} map fragment`} /><p>ADVENTURE COMPLETE</p><h3>Map piece found!</h3><p>{completed.length === 3 ? "The Lost Map is complete! Your progress will reset when the page is refreshed." : "This fragment has been added to the Lost Map."}</p><button className="play-button" onClick={returnToMap}>{completed.length === 3 ? "VIEW COMPLETE MAP" : "ADD TO THE MAP"} <span>›</span></button></div> : <>
              {active === "jungle" && <div className="fillword-game">
                <div className="fillword-hud"><span className="level-pill">LEVEL {round + 1} / 6</span><div className="level-track"><i style={{ width: `${((round + 1) / 6) * 100}%` }} /></div><span className="coin-pill">★ {foundWords.length}/{jungleLevel.words.length}</span></div>
                <div className="theme-heading"><span>{jungleLevel.icon}</span><div><small>WORD THEME</small><h3>{jungleLevel.theme}</h3></div></div>
                <p className="fillword-instruction">Click letters in order. Move only ↑ ↓ ← →. <strong>NO DIAGONAL MOVES.</strong></p>
                <div className="fillword-layout">
                  <div className="fillword-board" style={{ gridTemplateColumns: `repeat(${jungleLevel.size}, 1fr)`, "--field-size": jungleLevel.size } as React.CSSProperties}>
                    {jungleGrid.map((letter, index) => <button key={index} className={`${picked.includes(String(index)) ? "selected" : ""} ${foundWords.some((word) => { let offset = 0; for (const item of jungleLevel.words) { const start = offset; offset += item.length; if (item === word) { const order = makeFillwordPath(jungleLevel).indexOf(index); return order >= start && order < offset; } } return false; }) ? "solved" : ""}`} onClick={() => chooseJungle(index)} aria-label={`Letter ${letter}`}>{letter}</button>)}
                  </div>
                  <div className="word-bank"><small>FIND THESE WORDS</small><div>{jungleWordBank.map((word) => <span className={foundWords.includes(word) ? "found" : ""} key={word}>{foundWords.includes(word) ? "✓ " : ""}{word}</span>)}</div></div>
                </div>
                <p className="selection-readout" aria-live="polite">{message || "Choose the first letter of any word"}</p>
                {levelReward && <div className="level-reward"><div className="reward-rays" /><span className="reward-icon">{round === 5 ? "👑" : round % 2 ? "🪙" : "🏆"}</span><small>LEVEL COMPLETE!</small><h3>{levelReward}</h3><p>Your prize has been added to the explorer&apos;s collection.</p><button className="play-button" onClick={nextJungleLevel}>{round === 5 ? "CLAIM MAP PIECE" : `CONTINUE TO LEVEL ${round + 2}`} <span>›</span></button></div>}
              </div>}
              {active === "temple" && gameOver ? <div className="game-over temple-over"><p className="mission">THE SPELL COLLAPSED</p><h3>Restart the magical workshop</h3><p>Catch the word spheres in the correct order and protect your three lives.</p><button className="play-button" onClick={() => openGame("temple")}>TRY AGAIN <span>›</span></button></div> : active === "temple" && <><div className="jungle-hud temple-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(3 - lives)}</span><span>CHAMBER {round + 1} / 6</span><span className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>⏱ {timeLeft}s</span></div><p className="mission">MAGICAL WORKSHOP · {templeRounds[round].topic}</p><div className="spell-clue"><span>✦</span><div><small>CREATE A SPELL ABOUT</small><p>{templeRounds[round].clue}</p></div><button className="listen temple-listen" onClick={speakTemple} aria-label="Hear the complete spell">🔊 HEAR CLUE</button></div><div className={`temple-altar ${picked.length === templeRounds[round].words.length ? "activated" : ""}`}><div className="altar-runes">◇ ✦ ◇</div><div className="altar-slots">{templeRounds[round].words.map((word, index) => <span className={picked[index] ? "filled" : ""} key={`${word}-${index}`}>{picked[index] || "?"}</span>)}</div><div className="altar-base">THE SENTENCE ALTAR</div></div><p className="orb-instruction">Catch the spheres in the correct order</p><div className="magic-orbs">{options.map((option, index) => <button key={option} className={picked.includes(option) ? "captured" : ""} disabled={picked.includes(option)} style={{ animationDelay: `${index * -0.43}s` }} onClick={() => chooseTempleWord(option)}><span>{option}</span></button>)}</div></>}
              {active === "pirate" && gameOver ? <div className="game-over pirate-over"><p className="mission">THE SEARCH IS OVER</p><h3>The island keeps its secrets</h3><p>Listen carefully and search every corner of the picture.</p><button className="play-button" onClick={() => openGame("pirate")}>TRY AGAIN <span>›</span></button></div> : active === "pirate" && <><div className="jungle-hud pirate-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(5 - lives)}</span><span>FOUND {picked.length} / 8</span><span className={`timer ${audioPlayed && timeLeft <= 5 ? "danger" : ""}`}>{audioPlayed ? `⏱ ${timeLeft}s` : "⏱ READY"}</span></div><div className="hidden-mission"><div><p className="mission">AUDIO HIDDEN-OBJECT MISSION</p><small>{audioPlayed ? "The clue is playing. Find the object in the scene." : "The written clue is hidden — listen to begin."}</small></div><button className="listen audio-only" onClick={speak} disabled={audioPlaysLeft === 0}>🔊 {audioPlayed ? "REPLAY CLUE" : "PLAY AUDIO CLUE"} · {audioPlaysLeft}</button></div><div className={`hidden-scene ${audioPlayed ? "searching" : "locked"}`} onClick={loseHiddenLife} role="application" aria-label="Pirate island hidden-object scene"><Image src={`${basePath}/pirate-hidden-objects.png`} alt="A detailed pirate island cove with hidden objects" fill sizes="(max-width: 850px) 94vw, 760px" priority />{hiddenItems.map((item) => <button key={item.id} className={`object-hotspot ${picked.includes(item.id) ? "found" : ""}`} disabled={picked.includes(item.id) || !audioPlayed} style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, height: `${item.h}%` }} onClick={(event) => { event.stopPropagation(); chooseHiddenItem(item.id); }} aria-label={picked.includes(item.id) ? `${item.label}, found` : "Hidden object"}>{picked.includes(item.id) && <span>✓</span>}</button>)}</div><div className="found-strip">{hiddenItems.map((item) => <span className={picked.includes(item.id) ? "found" : ""} key={item.id}>{picked.includes(item.id) ? `✓ ${item.label}` : "?"}</span>)}</div></>}
              {!gameOver && active !== "jungle" && <div className="game-status"><span>{`${lives} lives`}</span><p aria-live="polite">{message || (active === "pirate" ? (audioPlayed ? "Search the picture" : "Play the audio clue") : "Choose your answer")}</p><b>{active === "pirate" ? `${"◆".repeat(picked.length)}${"◇".repeat(8 - picked.length)}` : `${"◆".repeat(round)}${"◇".repeat(6 - round)}`}</b></div>}
            </>}
          </div>
        </div>
      </div>}
    </main>
  );
}
