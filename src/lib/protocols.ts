export interface Protocol {
  id: string;
  title: string;
  category: ProtocolCategory;
  durationLabel: string;
  summary: string;
  steps: string[];
}

export type ProtocolCategory =
  | "breathing"
  | "movement"
  | "mindset"
  | "sensory"
  | "social";

export const CATEGORY_LABELS: Record<ProtocolCategory, string> = {
  breathing: "Breathing",
  movement: "Movement",
  mindset: "Mindset",
  sensory: "Sensory",
  social: "Social",
};

export const PROTOCOLS: Protocol[] = [
  // --- Breathing ---
  {
    id: "box-breathing",
    title: "Box Breathing",
    category: "breathing",
    durationLabel: "2 min",
    summary: "Inhale, hold, exhale, hold — each for 4 seconds.",
    steps: [
      "Sit upright and exhale fully.",
      "Inhale through your nose for 4 seconds.",
      "Hold your breath for 4 seconds.",
      "Exhale slowly through your mouth for 4 seconds.",
      "Hold empty for 4 seconds.",
      "Repeat the cycle for the full 2 minutes.",
    ],
  },
  {
    id: "4-7-8-breathing",
    title: "4-7-8 Breathing",
    category: "breathing",
    durationLabel: "2 min",
    summary: "Calming breath pattern to activate your rest response.",
    steps: [
      "Place the tip of your tongue behind your upper front teeth.",
      "Exhale completely through your mouth.",
      "Inhale quietly through your nose for 4 seconds.",
      "Hold your breath for 7 seconds.",
      "Exhale through your mouth for 8 seconds.",
      "Repeat for the full 2 minutes.",
    ],
  },
  {
    id: "energizing-breath",
    title: "Energizing Breath",
    category: "breathing",
    durationLabel: "2 min",
    summary: "Quick, rhythmic breathing to boost alertness.",
    steps: [
      "Sit tall with your spine straight.",
      "Take a sharp inhale through your nose.",
      "Follow with a forceful exhale through your nose.",
      "Keep breaths short and equal in duration.",
      "Maintain a steady rhythm of about 2–3 cycles per second.",
      "Pause after 30 seconds, breathe normally, then repeat.",
    ],
  },
  // --- Movement ---
  {
    id: "desk-stretch",
    title: "Desk Stretch",
    category: "movement",
    durationLabel: "2 min",
    summary: "Quick stretches you can do without leaving your chair.",
    steps: [
      "Roll your shoulders backward 5 times, then forward 5 times.",
      "Interlace your fingers and push palms to the ceiling for 15 seconds.",
      "Turn your head slowly left, hold 10 seconds, then right.",
      "Cross one arm over your chest, hold 10 seconds, switch.",
      "Rotate your wrists 10 times in each direction.",
      "Take three deep breaths to finish.",
    ],
  },
  {
    id: "body-shake",
    title: "Body Shake-Off",
    category: "movement",
    durationLabel: "2 min",
    summary: "Shake out tension from head to toe.",
    steps: [
      "Stand up and find a small space to move.",
      "Shake your hands vigorously for 20 seconds.",
      "Add your arms, letting them flop loosely.",
      "Bounce on your toes and shake your legs one at a time.",
      "Shake your whole body freely for 30 seconds.",
      "Slow down gradually and stand still; notice the calm.",
    ],
  },
  {
    id: "walking-reset",
    title: "Walking Reset",
    category: "movement",
    durationLabel: "2 min",
    summary: "A brief mindful walk to shift your state.",
    steps: [
      "Stand up and begin walking at a slow pace.",
      "Focus on the sensation of each foot touching the ground.",
      "Breathe naturally and let your arms swing freely.",
      "After 1 minute, pause and notice how your body feels.",
      "Resume walking for the remaining time.",
      "Return to your seat with intention.",
    ],
  },
  // --- Mindset ---
  {
    id: "intention-set",
    title: "Intention Setting",
    category: "mindset",
    durationLabel: "2 min",
    summary: "Clarify one clear intention for the next task.",
    steps: [
      "Close your eyes and take 3 slow breaths.",
      "Ask yourself: what is the single most important outcome?",
      "Formulate a short, specific intention in one sentence.",
      "Repeat the intention silently three times.",
      "Visualize yourself completing the task successfully.",
      "Open your eyes and write the intention down if possible.",
    ],
  },
  {
    id: "gratitude-pause",
    title: "Gratitude Pause",
    category: "mindset",
    durationLabel: "2 min",
    summary: "Name three things you are grateful for right now.",
    steps: [
      "Sit quietly and close your eyes.",
      "Think of one person you are grateful for — picture them.",
      "Think of one thing that went well today, however small.",
      "Think of one ability or resource you have access to.",
      "Hold all three in mind and notice how it feels.",
      "Open your eyes and carry that feeling forward.",
    ],
  },
  {
    id: "mental-rehearsal",
    title: "Mental Rehearsal",
    category: "mindset",
    durationLabel: "2 min",
    summary: "Walk through your next task step by step in your mind.",
    steps: [
      "Close your eyes and take two deep breaths.",
      "Picture the environment where you will do the next task.",
      "Visualize yourself starting the task confidently.",
      "Imagine handling the most challenging part smoothly.",
      "See yourself completing it and feeling satisfied.",
      "Open your eyes, ready to begin.",
    ],
  },
  // --- Sensory ---
  {
    id: "5-4-3-2-1",
    title: "5-4-3-2-1 Grounding",
    category: "sensory",
    durationLabel: "2 min",
    summary: "Use your five senses to ground into the present.",
    steps: [
      "Notice 5 things you can see — name them silently.",
      "Notice 4 things you can touch — feel each one.",
      "Notice 3 things you can hear — listen carefully.",
      "Notice 2 things you can smell — or imagine smells.",
      "Notice 1 thing you can taste — savor it.",
      "Take a deep breath and return your focus.",
    ],
  },
  {
    id: "cold-water-reset",
    title: "Cold Water Reset",
    category: "sensory",
    durationLabel: "2 min",
    summary: "Use cold water on your face/wrists to sharpen focus.",
    steps: [
      "Go to the nearest sink.",
      "Run cold water over your wrists for 15 seconds.",
      "Splash cold water on your face 3–4 times.",
      "Pat dry with a towel and notice the sensation.",
      "Take 3 slow breaths while standing still.",
      "Return to your workspace feeling refreshed.",
    ],
  },
  {
    id: "music-shift",
    title: "Music Shift",
    category: "sensory",
    durationLabel: "2 min",
    summary: "Listen to one song that matches your desired state.",
    steps: [
      "Choose a song that matches the energy you want next.",
      "Put on headphones and press play.",
      "Close your eyes and focus only on the music.",
      "Let the rhythm influence your breathing and posture.",
      "When the 2 minutes end, carry that energy forward.",
      "Remove headphones and transition to your next task.",
    ],
  },
  // --- Social ---
  {
    id: "check-in-call",
    title: "Quick Check-In",
    category: "social",
    durationLabel: "2 min",
    summary: "Send a brief message or text to someone you care about.",
    steps: [
      "Think of one person you have not spoken to today.",
      "Open your messaging app or phone.",
      "Send a short, genuine message — just 1–2 sentences.",
      "Put the phone down; do not wait for a reply.",
      "Notice how reaching out made you feel.",
      "Shift your attention to the next task.",
    ],
  },
  {
    id: "compliment-drop",
    title: "Compliment Drop",
    category: "social",
    durationLabel: "2 min",
    summary: "Give a genuine compliment to someone nearby or online.",
    steps: [
      "Think of someone who did something helpful recently.",
      "Craft a specific, genuine compliment (not generic).",
      "Deliver it — in person, via chat, or email.",
      "Do not expect anything in return.",
      "Take a breath and notice how giving feels.",
      "Move on to your next task.",
    ],
  },
  {
    id: "boundary-set",
    title: "Boundary Setting",
    category: "social",
    durationLabel: "2 min",
    summary: "Mentally define one boundary for the next work block.",
    steps: [
      "Close your eyes and take a deep breath.",
      "Identify one thing that drained your energy recently.",
      "Decide on one clear boundary — what you will say no to.",
      "Phrase it simply: 'During the next block I will not…'",
      "Commit to it silently and take another deep breath.",
      "Open your eyes and begin your next task with that boundary.",
    ],
  },
];

export function getProtocol(id: string): Protocol | undefined {
  return PROTOCOLS.find((p) => p.id === id);
}

export function getProtocolsByCategory(
  category: ProtocolCategory,
): Protocol[] {
  return PROTOCOLS.filter((p) => p.category === category);
}

export const ALL_CATEGORIES: ProtocolCategory[] = [
  "breathing",
  "movement",
  "mindset",
  "sensory",
  "social",
];
