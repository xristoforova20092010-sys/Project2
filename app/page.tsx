"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GameId = "jungle" | "temple" | "pirate";
type Game = { id: GameId; number: string; title: string; subtitle: string; image: string; accent: string; icon: string; how: string };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const games: Game[] = [
  { id: "jungle", number: "I", title: "Jungle Word Hunt", subtitle: "Spot the right animals and reveal a hidden English word, one letter at a time.", image: `${basePath}/jungle-quest.png`, accent: "#42f5df", icon: "🌿", how: "Find all six monkeys hidden among the jungle animals. Every correct picture reveals the next letter of the secret word. A wrong animal costs one of your three lives. Complete the word before time runs out to earn the green map piece." },
  { id: "temple", number: "II", title: "Temple Grammar Trials", subtitle: "Listen, race the clock and solve increasingly difficult grammar puzzles.", image: `${basePath}/temple-trials.png`, accent: "#ffc94b", icon: "🏛️", how: "Complete six timed grammar trials with three lives. Listen to every sentence, choose the missing words and open all six temple doors to reveal the golden map piece." },
  { id: "pirate", number: "III", title: "Pirate Island Mystery", subtitle: "Master limited audio clues before time and lives run out.", image: `${basePath}/pirate-island.png`, accent: "#4de8ff", icon: "⚓", how: "Complete six timed listening trials with three lives. You must play each audio clue before answering and may hear it only twice. Choose among increasingly similar landmarks to unlock the blue map piece." },
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
const jungleWord = "MONKEY";
const jungleTiles = [
  { id: "monkey-1", animal: "Monkey", correct: true, position: "0% 0%" },
  { id: "tiger", animal: "Tiger", correct: false, position: "33.333% 0%" },
  { id: "monkey-2", animal: "Monkey", correct: true, position: "66.666% 0%" },
  { id: "parrot", animal: "Parrot", correct: false, position: "100% 0%" },
  { id: "elephant", animal: "Elephant", correct: false, position: "0% 50%" },
  { id: "monkey-3", animal: "Monkey", correct: true, position: "33.333% 50%" },
  { id: "toucan", animal: "Toucan", correct: false, position: "66.666% 50%" },
  { id: "monkey-4", animal: "Monkey", correct: true, position: "100% 50%" },
  { id: "monkey-5", animal: "Monkey", correct: true, position: "0% 100%" },
  { id: "snake", animal: "Snake", correct: false, position: "33.333% 100%" },
  { id: "frog", animal: "Frog", correct: false, position: "66.666% 100%" },
  { id: "monkey-6", animal: "Monkey", correct: true, position: "100% 100%" },
];
const templeRounds = [
  { prompt: "Tom ___ football every Saturday.", seconds: 22, options: ["play", "plays", "is play", "playing"], answer: "plays", topic: "PRESENT SIMPLE" },
  { prompt: "There ___ two parrots in the ancient tree.", seconds: 20, options: ["is", "are", "was", "be"], answer: "are", topic: "THERE IS / ARE" },
  { prompt: "The explorers ___ the first door yesterday.", seconds: 18, options: ["open", "opened", "are opening", "opens"], answer: "opened", topic: "PAST SIMPLE" },
  { prompt: "Look! The guardian ___ across the bridge now.", seconds: 16, options: ["runs", "ran", "is running", "running"], answer: "is running", topic: "PRESENT CONTINUOUS" },
  { prompt: "Mia ___ enter the chamber because the door was locked.", seconds: 15, options: ["can", "could", "couldn't", "doesn't"], answer: "couldn't", topic: "MODAL VERBS" },
  { prompt: "If we find the final key, we ___ the treasure room.", seconds: 14, options: ["opened", "will open", "open", "are opening", "opens"], answer: "will open", topic: "FIRST CONDITIONAL" },
];
const pirateRounds = [
  { prompt: "Find the place with a tall brown trunk, no branches near the ground, and green leaves at the top.", seconds: 22, options: ["🌴 Palm tree", "🌳 Jungle tree", "🗼 Lighthouse", "🪨 Rocks"], answer: "🌴 Palm tree" },
  { prompt: "Find the structure explorers use to cross the river without getting their boots wet.", seconds: 20, options: ["🌉 Bridge", "⛵ Ship", "🛶 Boat", "💧 Waterfall"], answer: "🌉 Bridge" },
  { prompt: "Find the tall coastal tower whose rotating light warns sailors about danger at night.", seconds: 18, options: ["🗼 Lighthouse", "🏰 Watchtower", "⛵ Ship", "🏚️ Old house", "🪨 Rocks"], answer: "🗼 Lighthouse" },
  { prompt: "Find the dark natural shelter hidden inside the rocky hill, not the building beside it.", seconds: 17, options: ["🕳️ Cave", "🏚️ Old house", "⛺ Camp", "🪨 Rocks", "🌋 Crater"], answer: "🕳️ Cave" },
  { prompt: "Follow the sound of water dropping over a high cliff into a pool below.", seconds: 15, options: ["💧 Waterfall", "🌊 River", "🏝️ Lagoon", "🌊 Shore", "🌉 Bridge", "🕳️ Cave"], answer: "💧 Waterfall" },
  { prompt: "Choose the large sailing vessel anchored beyond the reef, not the smaller boat near the beach.", seconds: 14, options: ["⛵ Ship", "🛶 Boat", "🏴‍☠️ Raft", "🗼 Lighthouse", "🏝️ Island", "⚓ Harbour"], answer: "⛵ Ship" },
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

  useEffect(() => {
    localStorage.removeItem("english-adventure-progress");
    sessionStorage.removeItem("english-adventure-show-map");
  }, []);

  const game = useMemo(() => games.find((item) => item.id === active), [active]);

  useEffect(() => {
    if ((active !== "jungle" && active !== "temple" && active !== "pirate") || (active === "pirate" && !audioPlayed) || gameOver || message.includes("Map piece found")) return;
    const timer = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active, audioPlayed, gameOver, message, round]);

  useEffect(() => {
    if ((active !== "jungle" && active !== "temple" && active !== "pirate") || (active === "pirate" && !audioPlayed) || gameOver || timeLeft !== 0 || message.includes("Map piece found")) return;
    const timeout = window.setTimeout(() => {
      const nextLives = lives - 1;
      setLives(nextLives);
      setPicked([]);
      if (nextLives <= 0) {
        setGameOver(true);
        setMessage(active === "jungle" ? "Time is up. The jungle wins this time!" : active === "temple" ? "Time is up. The temple doors are sealed!" : "Time is up. The treasure trail is lost!");
      } else {
        setMessage("Time is up — one life lost. Try this trial again!");
        setTimeLeft(active === "jungle" ? 45 : active === "temple" ? templeRounds[round].seconds : pirateRounds[round].seconds);
        window.setTimeout(() => setMessage(""), 1200);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [active, audioPlayed, gameOver, lives, message, round, timeLeft]);

  function getOptions(id: GameId, index: number) {
    const source = id === "jungle" ? jungleRounds[index].options : id === "temple" ? templeRounds[index].options : pirateRounds[index].options;
    return shuffled(source);
  }
  function openGame(id: GameId) { setActive(id); setRound(0); setPicked([]); setMessage(""); setRevealedClue(""); setLives(3); setJungleStage(0); setGameOver(false); setAudioPlayed(false); setAudioPlaysLeft(2); setTimeLeft(id === "jungle" ? 45 : id === "temple" ? templeRounds[0].seconds : id === "pirate" ? pirateRounds[0].seconds : 0); setOptions(getOptions(id, 0)); }
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
  function chooseJungle(tileId: string) {
    const tile = jungleTiles.find((item) => item.id === tileId);
    if (!tile || picked.includes(tileId) || gameOver) return;
    if (!tile.correct) {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "No lives left. The jungle wins this time!" : `That is a ${tile.animal}, not a monkey — one life lost!`);
      if (nextLives <= 0) setGameOver(true);
      return;
    }
    const next = [...picked, tileId];
    setPicked(next);
    setMessage(`Great! You found the letter ${jungleWord[next.length - 1]}.`);
    if (next.length === jungleWord.length) setTimeout(() => finish("jungle"), 650);
  }
  function chooseAnswer(option: string, id: "temple" | "pirate") {
    const data = id === "temple" ? templeRounds[round] : pirateRounds[round];
    if (option === data.answer) {
      if (id === "pirate") { setRevealedClue(data.prompt); setMessage("Correct! The clue is revealed below."); setTimeout(() => advance(id), 1450); }
      else advance(id);
    } else if (id === "temple") {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "No lives left. The temple doors are sealed!" : "Wrong key — one life lost!");
      if (nextLives <= 0) setGameOver(true);
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "No lives left. The treasure trail is lost!" : "The compass points elsewhere — one life lost!");
      if (nextLives <= 0) setGameOver(true);
    }
  }
  function speak() {
    if (!("speechSynthesis" in window)) { setMessage("Audio is not supported in this browser."); return; }
    if (audioPlaysLeft <= 0) { setMessage("No audio replays left — trust your memory!"); return; }
    setAudioPlayed(true); setAudioPlaysLeft((count) => count - 1); setMessage("");
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(pirateRounds[round].prompt); utterance.lang = "en-US"; utterance.rate = 0.85; speechSynthesis.speak(utterance);
  }
  function speakTemple() {
    if (!("speechSynthesis" in window)) { setMessage("Audio is not supported in this browser."); return; }
    speechSynthesis.cancel();
    const text = templeRounds[round].prompt.replace("___", "blank");
    const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "en-US"; utterance.rate = 0.82;
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
          <div className="game-banner"><Image src={game.image} alt="" fill sizes="800px" /><div /><button className="close" onClick={closeGame} aria-label="Close game">×</button><p>CHAPTER {game.number}{active === "jungle" ? " · WORD HUNT" : ` · TRIAL ${Math.min(round + 1, 6)} / 6`}</p><h2>{game.title}</h2></div>
          <div className="game-content">
            {message === "Map piece found! ✦" ? <div className="victory"><div className={`earned-fragment ${active}`} aria-label={`${active} map fragment`} /><p>ADVENTURE COMPLETE</p><h3>Map piece found!</h3><p>{completed.length === 3 ? "The Lost Map is complete! Your progress will reset when the page is refreshed." : "This fragment has been added to the Lost Map."}</p><button className="play-button" onClick={returnToMap}>{completed.length === 3 ? "VIEW COMPLETE MAP" : "ADD TO THE MAP"} <span>›</span></button></div> : <>
              {active === "jungle" && gameOver ? <div className="game-over"><p className="mission">EXPEDITION PAUSED</p><h3>Try the jungle trail again</h3><p>Choose carefully and keep an eye on the timer.</p><button className="play-button" onClick={() => openGame("jungle")}>TRY AGAIN <span>›</span></button></div> : active === "jungle" && <><div className="jungle-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(3 - lives)}</span><span className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>⏱ {timeLeft}s</span></div><p className="mission">JUNGLE WORD HUNT</p><h3>Find all the monkeys and reveal the word</h3><div className="word-progress" aria-label={`${picked.length} of ${jungleWord.length} letters revealed`}>{jungleWord.split("").map((letter, index) => <span className={index < picked.length ? "revealed" : ""} key={`${letter}-${index}`}>{index < picked.length ? letter : "?"}</span>)}</div><div className="jungle-picture-grid">{jungleTiles.map((tile) => <button key={tile.id} className={picked.includes(tile.id) ? "found" : ""} disabled={picked.includes(tile.id)} onClick={() => chooseJungle(tile.id)} aria-label={`${tile.animal}${picked.includes(tile.id) ? ", found" : ""}`}><span style={{ backgroundPosition: tile.position }} /></button>)}</div></>}
              {active === "temple" && gameOver ? <div className="game-over temple-over"><p className="mission">THE DOORS ARE SEALED</p><h3>Begin the grammar trials again</h3><p>Listen closely, watch the timer and protect your three lives.</p><button className="play-button" onClick={() => openGame("temple")}>TRY AGAIN <span>›</span></button></div> : active === "temple" && <><div className="jungle-hud temple-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(3 - lives)}</span><span className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>⏱ {timeLeft}s</span></div><p className="mission">{templeRounds[round].topic}</p><button className="listen temple-listen" onClick={speakTemple} aria-label="Listen to the sentence">🔊 LISTEN TO THE SENTENCE</button><h3>{templeRounds[round].prompt}</h3><div className={`answer-grid ${options.length > 4 ? "wide-options" : ""}`}>{options.map((option) => <button key={option} onClick={() => chooseAnswer(option, "temple")}>{option}</button>)}</div></>}
              {active === "pirate" && gameOver ? <div className="game-over pirate-over"><p className="mission">THE TRAIL IS LOST</p><h3>Listen for the island clues again</h3><p>Use your two audio plays wisely and choose before time runs out.</p><button className="play-button" onClick={() => openGame("pirate")}>TRY AGAIN <span>›</span></button></div> : active === "pirate" && <><div className="jungle-hud pirate-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(3 - lives)}</span><span className={`timer ${audioPlayed && timeLeft <= 5 ? "danger" : ""}`}>{audioPlayed ? `⏱ ${timeLeft}s` : "⏱ READY"}</span></div><p className="mission">LISTEN &amp; FIND</p><button className="listen audio-only" onClick={speak} disabled={audioPlaysLeft === 0}>🔊 {audioPlayed ? "PLAY CLUE AGAIN" : "PLAY AUDIO CLUE"} · {audioPlaysLeft} LEFT</button><p className="audio-instruction">{audioPlayed ? "Choose the matching landmark. The written clue stays hidden until you are correct." : "Play the clue to unlock the landmarks and start the timer."}</p><div className={`answer-grid pirate-options ${options.length > 4 ? "dense-pirate" : ""}`}>{options.map((option) => <button key={option} disabled={!audioPlayed} onClick={() => chooseAnswer(option, "pirate")}>{option}</button>)}</div>{revealedClue && <div className="revealed-clue"><small>CLUE REVEALED</small><p>{revealedClue}</p></div>}</>}
              {!gameOver && <div className="game-status"><span>{`${lives} lives`}</span><p aria-live="polite">{message || (active === "jungle" ? "Choose a monkey picture" : active === "pirate" ? (audioPlayed ? "Choose the place from memory" : "Play the audio clue") : "Choose your answer")}</p><b>{active === "jungle" ? `${picked.length} / ${jungleWord.length}` : `${"◆".repeat(round)}${"◇".repeat(6 - round)}`}</b></div>}
            </>}
          </div>
        </div>
      </div>}
    </main>
  );
}
