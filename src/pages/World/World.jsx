import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { useWorldState } from "./hooks/useWorldState";
import { useNPCProximity } from "./hooks/useNPCProximity";
import WorldCanvas from "./WorldCanvas";
import WorldScene from "./scenes/WorldScene";
import WorldHUD from "./ui/WorldHUD/WorldHUD";
import { useUserProgress } from "./hooks/useUserProgress";
import { CAREER_DIALOGUES } from "./data/careerScenes";
import { ALL_CAREERS } from "./data/careersList";
import CareerRouter from "./scenes/careers/CareerRouter";
import CameraManager from "./camera/FollowCamera";
import { GAME_COMPONENTS } from "./GamesRegistry";
import { NPCS } from "./data/npcsInfo";
import { Physics } from "@react-three/rapier";
import BackButton from "./ui/BackButton/BackButton";
import Loader from "./ui/Loader/Loader";
import HelpModal from "./ui/HelpModal/HelpModal";
import CareerSummary from "../Summary/Summary";
import worldMusic from "/assets/music/World.mp3";
import "./World.css";
import Settings from "./ui/Settings/Settings";

// Constantes para localStorage
const STORAGE_KEYS = {
  SOUND_ENABLED: "mlc_sound_enabled",
  VOLUME: "mlc_volume",
};

// Función para cargar configuración de sonido
const loadSoundSettings = () => {
  const savedSoundEnabled = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
  const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
  
  return {
    soundEnabled: savedSoundEnabled !== null ? savedSoundEnabled === "true" : true,
    volume: savedVolume !== null ? parseFloat(savedVolume) : 0.4,
  };
};

export default function World() {
  const {
    mode,
    setMode,
    dialogueIndex,
    setDialogueIndex,
    activeNPC,
    setActiveNPC,
    scene,
    setScene,
    activeCareer,
    setActiveCareer,
  } = useWorldState();
  
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(null);
  
  // Cargar configuración de sonido guardada
  const savedSettings = useMemo(() => loadSoundSettings(), []);
  const [soundEnabled, setSoundEnabled] = useState(savedSettings.soundEnabled);
  const [volume, setVolume] = useState(savedSettings.volume);
  
  const { visited, markVisited } = useUserProgress();
  const ActiveGame = GAME_COMPONENTS[activeCareer];
  const availableCareers = ALL_CAREERS.filter((c) => {
    const npc = NPCS[c];
    return npc && !visited.includes(npc.id);
  });
  
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const visibleCareers = availableCareers.slice(0, 3);
  const allCompleted = availableCareers.length === 0;
  
  useEffect(() => {
    if (allCompleted) {
      setScene("SUMMARY");
    }
  }, [allCompleted, setScene]);
  
  const ROUTES = [
    [
      [-6, -3, -5],
      [-2, -3, -5],
      [-2, -3, -20],
      [-6, -3, -20],
    ],
    [
      [2, -3, -8],
      [10, -3, -8],
      [10, -3, -25],
      [2, -3, -25],
    ],
    [
      [15, -3, -6],
      [24, -3, -6],
      [24, -3, -22],
      [15, -3, -22],
    ],
  ];
  
  const SPAWNS = [
    [-3, -3, -7],
    [6, -3, -10],
    [16, -3, -8],
  ];
  
  const worldNPCs = useMemo(() => {
    return visibleCareers.reduce((acc, careerId, index) => {
      acc[careerId] = {
        id: careerId,
        model: `/assets/models/npc/${careerId}.glb`,
        route: ROUTES[index] || ROUTES[0],
        position: SPAWNS[index] || [0, -3, 0],
      };
      return acc;
    }, {});
  }, [visibleCareers]);
  
  const [npcPositions, setNpcPositions] = useState({});
  const nearNPC = useNPCProximity(playerPos, npcPositions);
  const careerData = CAREER_DIALOGUES[activeCareer];

  const currentDialogue =
    scene === "CAREER" && activeCareer && careerData && mode !== "career-game"
      ? careerData[mode === "career-ending" ? "ending" : "intro"]?.[dialogueIndex]
      : null;

  // Inicializar audio al montar el componente
  useEffect(() => {
    audioRef.current = new Audio(worldMusic);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Actualizar volumen cuando cambie
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Manejar la interacción del usuario
  useEffect(() => {
    const enableAudio = () => {
      setUserInteracted(true);
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };

    window.addEventListener("click", enableAudio);
    window.addEventListener("keydown", enableAudio);
    window.addEventListener("touchstart", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
      window.removeEventListener("keydown", enableAudio);
      window.removeEventListener("touchstart", enableAudio);
    };
  }, []);

  // Controlar la reproducción del audio
  useEffect(() => {
    if (!audioRef.current) return;

    if (userInteracted && soundEnabled && scene === "WORLD") {
      audioRef.current.play().catch((error) => {
        console.log("Error reproduciendo audio:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [scene, soundEnabled, userInteracted]);

  // Guardar configuración cuando cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
  }, [volume]);

  const handleSoundToggle = (enabled, vol) => {
    setSoundEnabled(enabled);
    if (vol !== undefined) {
      setVolume(vol);
    }
    if (audioRef.current) {
      if (enabled) {
        audioRef.current.volume = vol !== undefined ? vol : volume;
        if (scene === "WORLD") {
          audioRef.current.play().catch(() => {});
        }
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <BackButton />

      <button
        className="world-help-btn"
        data-tooltip="Ayuda"
        onClick={() => setHelpOpen(true)}
      >
        ❓
      </button>
      
      <button
        className="world-settings-btn"
        data-tooltip="Configuración"
        onClick={() => setSettingsOpen(true)}
      >
        ⚙️
      </button>

      <WorldCanvas>
        <Suspense fallback={<Loader />}>
          {scene === "WORLD" && (
            <Physics gravity={[0, -9.8, 0]} debug>
              <WorldScene
                worldNPCs={worldNPCs}
                mode={mode}
                playerPos={playerPos}
                setPlayerPos={setPlayerPos}
                nearNPC={nearNPC}
                setNpcPositions={setNpcPositions}
                setActiveNPC={setActiveNPC}
                setMode={setMode}
              />
            </Physics>
          )}

          {scene === "CAREER" && activeCareer && mode !== "career-game" && (
            <CareerRouter
              key={activeCareer}
              careerId={activeCareer}
              mode={mode}
              setMode={setMode}
              dialogueIndex={dialogueIndex}
              setDialogueIndex={setDialogueIndex}
            />
          )}

          <CameraManager scene={scene} mode={mode} playerPos={playerPos} />
        </Suspense>
      </WorldCanvas>
      
      {scene === "CAREER" && mode === "career-game" && ActiveGame && (
        <ActiveGame
          onComplete={() => {
            setMode("career-ending");
            setDialogueIndex(0);
          }}
        />
      )}
      
      {scene === "SUMMARY" && <CareerSummary />}
      
      <WorldHUD
        scene={scene}
        mode={mode}
        dialogue={currentDialogue}
        onNext={() => {
          const careerData = CAREER_DIALOGUES[activeCareer];
          if (!careerData) return;

          const isEnding = mode === "career-ending";
          const phase = isEnding ? "ending" : "intro";
          const dialogues = careerData[phase];

          if (dialogueIndex + 1 < dialogues.length) {
            setDialogueIndex((i) => i + 1);
          } else {
            if (!isEnding) {
              setDialogueIndex(0);
              setMode("career-game");
            } else {
              setDialogueIndex(0);
              setMode("career-feedback");
            }
          }
        }}
        onAccept={async () => {
          if (mode === "interact") {
            setScene("CAREER");
            setActiveCareer(activeNPC);
            setDialogueIndex(0);
            setMode("dialogue");
            return;
          }
          if (mode === "career-feedback") {
            markVisited(activeCareer);
            setScene("WORLD");
            setActiveCareer(null);
            setActiveNPC(null);
            setDialogueIndex(0);
            setMode("explore");
          }
        }}
        onReject={() => {
          if (mode === "interact") {
            setActiveNPC(null);
            setMode("explore");
            return;
          }
          if (mode === "career-feedback") {
            setScene("WORLD");
            setActiveCareer(null);
            setActiveNPC(null);
            setDialogueIndex(0);
            setMode("explore");
          }
        }}
        activeCareer={activeCareer}
        activeNPC={activeNPC}
      />
      
      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      
      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        volume={volume}
        onVolumeChange={handleVolumeChange}
      />
    </>
  );
}