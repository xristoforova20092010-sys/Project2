"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GameId = "jungle" | "temple" | "pirate";
type Game = { id: GameId; number: string; title: string; subtitle: string; image: string; accent: string; icon: string; how: string };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const games: Game[] = [
  { id: "jungle", number: "I", title: "Jungle Word Quest", subtitle: "Race the clock, protect your lives and master the jungle vocabulary trail.", image: `${basePath}/jungle-quest.png`, accent: "#42f5df", icon: "🌿", how: "Complete six timed missions with three lives. The number of choices grows in every round. Finish with a mixed-category jungle challenge to unlock the green map piece." },
  { id: "temple", number: "II", title: "Temple Grammar Trials", subtitle: "Solve grammar puzzles, open ancient doors and cross the bridge.", image: `${basePath}/temple-trials.png`, accent: "#ffc94b", icon: "🏛️", how: "Complete six sentences by choosing the correct grammar answer. Six opened doors reveal the golden map piece." },
  { id: "pirate", number: "III", title: "Pirate Island Mystery", subtitle: "Listen to clues, explore the island and discover the hidden treasure.", image: `${basePath}/pirate-island.png`, accent: "#4de8ff", icon: "⚓", how: "Listen carefully without reading the clue, then choose the matching landmark. The clue appears only after your choice. Six clues unlock the blue map piece." },
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
const templeRounds = [
  { prompt: "Tom ___ football every Saturday.", options: ["play", "plays", "playing"], answer: "plays" },
  { prompt: "There ___ two parrots in the tree.", options: ["is", "are", "am"], answer: "are" },
  { prompt: "She ___ got a treasure map.", options: ["have", "has", "having"], answer: "has" },
  { prompt: "I ___ swim across the river.", options: ["can", "cans", "am"], answer: "can" },
  { prompt: "The compass ___ on the table.", options: ["are", "is", "be"], answer: "is" },
  { prompt: "The key is ___ the treasure chest.", options: ["under", "at", "have"], answer: "under" },
];
const pirateRounds = [
  { prompt: "Which place has a tall brown trunk and green leaves at the top?", options: ["🌴 Palm tree", "⛵ Ship", "💧 Waterfall"], answer: "🌴 Palm tree" },
  { prompt: "Which place lets explorers walk safely over the river?", options: ["🌉 Bridge", "🗼 Lighthouse", "🏚️ Old house"], answer: "🌉 Bridge" },
  { prompt: "Which place shines a bright light to guide ships at night?", options: ["🪨 Rocks", "🗼 Lighthouse", "⛵ Ship"], answer: "🗼 Lighthouse" },
  { prompt: "Which place is dark inside and opens in the side of a rocky hill?", options: ["🌊 River", "🌴 Palm tree", "🕳️ Cave"], answer: "🕳️ Cave" },
  { prompt: "Which place has water falling from high rocks into a pool?", options: ["💧 Waterfall", "🏚️ Old house", "🌉 Bridge"], answer: "💧 Waterfall" },
  { prompt: "Which place floats on the sea and carries sailors between islands?", options: ["🗼 Lighthouse", "⛵ Ship", "🪨 Rocks"], answer: "⛵ Ship" },
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

  useEffect(() => {
    const saved = localStorage.getItem("english-adventure-progress");
    if (saved) window.setTimeout(() => setCompleted(JSON.parse(saved)), 0);
    if (sessionStorage.getItem("english-adventure-show-map") === "yes") {
      sessionStorage.removeItem("english-adventure-show-map");
      window.setTimeout(() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
    }
  }, []);

  const game = useMemo(() => games.find((item) => item.id === active), [active]);

  useEffect(() => {
    if (active !== "jungle" || gameOver || message.includes("Map piece found")) return;
    const timer = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [active, gameOver, message, round]);

  useEffect(() => {
    if (active !== "jungle" || gameOver || timeLeft !== 0 || message.includes("Map piece found")) return;
    const timeout = window.setTimeout(() => {
      const nextLives = lives - 1;
      setLives(nextLives);
      setPicked([]);
      if (nextLives <= 0) {
        setGameOver(true);
        setMessage("Time is up. The jungle wins this time!");
      } else {
        setMessage("Time is up — one life lost. Try this mission again!");
        setTimeLeft(jungleRounds[round].seconds);
        window.setTimeout(() => setMessage(""), 1200);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [active, gameOver, lives, message, round, timeLeft]);

  function getOptions(id: GameId, index: number) {
    const source = id === "jungle" ? jungleRounds[index].options : id === "temple" ? templeRounds[index].options : pirateRounds[index].options;
    return shuffled(source);
  }
  function openGame(id: GameId) { setActive(id); setRound(0); setPicked([]); setMessage(""); setRevealedClue(""); setLives(3); setJungleStage(0); setGameOver(false); setTimeLeft(id === "jungle" ? jungleRounds[0].seconds : 0); setOptions(getOptions(id, 0)); }
  function closeGame() { setActive(null); setRound(0); setPicked([]); setMessage(""); setRevealedClue(""); }
  function returnToMap() {
    if (completed.length === 3) {
      closeGame();
      window.setTimeout(() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      sessionStorage.setItem("english-adventure-show-map", "yes");
      window.setTimeout(() => window.location.reload(), 3200);
      return;
    }
    closeGame();
    window.setTimeout(() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }
  function finish(id: GameId) {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next); localStorage.setItem("english-adventure-progress", JSON.stringify(next));
    setMessage("Map piece found! ✦");
  }
  function advance(id: GameId) {
    if (round === 5) finish(id); else {
      const nextRound = round + 1;
      setRound(nextRound); setPicked([]); setRevealedClue(""); setJungleStage(0); setOptions(getOptions(id, nextRound));
      if (id === "jungle") setTimeLeft(jungleRounds[nextRound].seconds);
      setMessage("Correct! The path opens…"); setTimeout(() => setMessage(""), 900);
    }
  }
  function chooseJungle(option: string) {
    const data = jungleRounds[round];
    const correct = round === 5 ? jungleFinalStages[jungleStage].correct : data.correct;
    if (!correct.includes(option)) {
      const nextLives = lives - 1;
      setLives(nextLives);
      setMessage(nextLives <= 0 ? "No lives left. The jungle wins this time!" : "Wrong choice — one life lost!");
      if (nextLives <= 0) setGameOver(true);
      return;
    }
    const next = [...picked, option]; setPicked(next); setMessage("Great find!");
    if (next.length === correct.length) {
      if (round === 5 && jungleStage < jungleFinalStages.length - 1) {
        setTimeout(() => { setJungleStage((stage) => stage + 1); setPicked([]); setMessage("Category cleared — keep going!"); }, 400);
      } else setTimeout(() => advance("jungle"), 450);
    }
  }
  function chooseAnswer(option: string, id: "temple" | "pirate") {
    const data = id === "temple" ? templeRounds[round] : pirateRounds[round];
    if (id === "pirate") setRevealedClue(data.prompt);
    if (option === data.answer) {
      if (id === "pirate") { setMessage("Correct! The clue is revealed below."); setTimeout(() => advance(id), 1150); }
      else advance(id);
    } else setMessage(id === "temple" ? "The door stays closed. Try again!" : "The compass points elsewhere. Listen again and try another place.");
  }
  function speak() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(pirateRounds[round].prompt); utterance.lang = "en-US"; utterance.rate = 0.85; speechSynthesis.speak(utterance);
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
          <div className="game-banner"><Image src={game.image} alt="" fill sizes="800px" /><div /><button className="close" onClick={closeGame} aria-label="Close game">×</button><p>CHAPTER {game.number} · TRIAL {Math.min(round + 1, 6)} / 6</p><h2>{game.title}</h2></div>
          <div className="game-content">
            {message === "Map piece found! ✦" ? <div className="victory"><div className={`earned-fragment ${active}`} aria-label={`${active} map fragment`} /><p>ADVENTURE COMPLETE</p><h3>Map piece found!</h3><p>{completed.length === 3 ? "All fragments are ready. Watch them join before the site refreshes." : "This fragment has been added to the Lost Map."}</p><button className="play-button" onClick={returnToMap}>{completed.length === 3 ? "ASSEMBLE THE MAP" : "ADD TO THE MAP"} <span>›</span></button></div> : <>
              {active === "jungle" && gameOver ? <div className="game-over"><p className="mission">EXPEDITION PAUSED</p><h3>Try the jungle trail again</h3><p>Choose carefully and keep an eye on the timer.</p><button className="play-button" onClick={() => openGame("jungle")}>TRY AGAIN <span>›</span></button></div> : active === "jungle" && <><div className="jungle-hud"><span className="lives" aria-label={`${lives} lives remaining`}>{"❤️".repeat(lives)}{"♡".repeat(3 - lives)}</span><span className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>⏱ {timeLeft}s</span></div><p className="mission">{round === 5 ? `FINAL · STEP ${jungleStage + 1} / 3` : "MISSION"}</p><h3>{round === 5 ? jungleFinalStages[jungleStage].prompt : jungleRounds[round].prompt}</h3><div className={`answer-grid picture-grid ${options.length > 8 ? "dense" : ""}`}>{options.map((option) => <button key={option} className={picked.includes(option) ? "selected" : ""} disabled={picked.includes(option)} onClick={() => chooseJungle(option)}>{option}</button>)}</div></>}
              {active === "temple" && <><p className="mission">CHOOSE THE KEY</p><h3>{templeRounds[round].prompt}</h3><div className="answer-grid">{options.map((option) => <button key={option} onClick={() => chooseAnswer(option, "temple")}>{option}</button>)}</div></>}
              {active === "pirate" && <><p className="mission">LISTEN &amp; FIND</p><button className="listen audio-only" onClick={speak}>🔊 PLAY AUDIO CLUE</button><p className="audio-instruction">Listen carefully, then choose the correct place.</p><div className="answer-grid">{options.map((option) => <button key={option} onClick={() => chooseAnswer(option, "pirate")}>{option}</button>)}</div>{revealedClue && <div className="revealed-clue"><small>CLUE REVEALED</small><p>{revealedClue}</p></div>}</>}
              {!gameOver && <div className="game-status"><span>{active === "jungle" ? `${lives} lives` : "3 lives"}</span><p aria-live="polite">{message || (active === "pirate" ? "Play the clue and choose a place" : "Choose your answer")}</p><b>{"◆".repeat(round)}{"◇".repeat(6 - round)}</b></div>}
            </>}
          </div>
        </div>
      </div>}
    </main>
  );
}
