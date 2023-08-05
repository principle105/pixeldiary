export const GRID_HEIGHT = 11;
export const GRID_WIDTH = 11;

interface Palette {
    name: string;
    emoji: string;
    colors: string[];
}

export const PALETTES: Palette[] = [
    {
        name: "Joyful",
        emoji: "😄",
        colors: [
            "#FFE7CC",
            "#FFD89E",
            "#FFC280",
            "#FFB266",
            "#FFA14D",
            "#FF9033",
            "#FF7F19",
            "#FF6E00",
        ],
    },
    {
        name: "Calm",
        emoji: "😌",
        colors: [
            "#CCE7CC",
            "#9ED89E",
            "#80C280",
            "#66B266",
            "#4DA14D",
            "#339033",
            "#198019",
            "#006E00",
        ],
    },
    {
        name: "Sad",
        emoji: "😔",
        colors: [
            "#CCE7FF",
            "#9ED8FF",
            "#80C2FF",
            "#66B2FF",
            "#4DA1FF",
            "#3390FF",
            "#1980FF",
            "#006EFF",
        ],
    },
    {
        name: "Angry",
        emoji: "😡",
        colors: [
            "#FFD9D9",
            "#FFB2B2",
            "#FF8C8C",
            "#FF6666",
            "#FF4040",
            "#FF1A1A",
            "#E60000",
            "#C70000",
        ],
    },
    {
        name: "Grateful",
        emoji: "🙏",
        colors: [
            "#FFF2CC",
            "#FFE6B2",
            "#FFD999",
            "#FFCD7F",
            "#FFC266",
            "#FFB84D",
            "#FFAC33",
            "#FFA019",
        ],
    },
    {
        name: "Lonely",
        emoji: "😢",
        colors: [
            "#B3CCFF",
            "#99B7E6",
            "#809CCC",
            "#668DB3",
            "#4D789C",
            "#336480",
            "#1A3D66",
            "#004D4D",
        ],
    },
    {
        name: "Hopeful",
        emoji: "🕊️",
        colors: [
            "#ccffe0",
            "#b1e7c9",
            "#96d0b3",
            "#7cb99d",
            "#62a288",
            "#478c73",
            "#2b7760",
            "#00624d",
        ],
    },
    {
        name: "Creative",
        emoji: "🎨",
        colors: [
            "#F2D9FF",
            "#D2B2FF",
            "#B380FF",
            "#9366FF",
            "#754DFF",
            "#5633FF",
            "#3A19FF",
            "#2100FF",
        ],
    },
];
