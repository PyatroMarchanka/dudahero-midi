import ToneJS from "@tonejs/midi";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const songSchema = new mongoose.Schema({
  labels: [String],
  timeSignature: String,
  name: String,
  type: String,
  pathName: String,
  id: String,
  about: String,
  originalTempo: String,
  transcribedBy: String,
  stats: {
    views: Number,
  },
  links: [String],
  bagpipesToPlay: [String],
});

const Song = mongoose.model("songs", songSchema);

const connectToMongoDB = async () => {
  const dbName = "dudahero";
  await mongoose.connect(process.env.MONGO_CONN_STRING, { dbName });
};

const getSongListFromMongoDB = async () => {
  try {
    console.log("process.env.MONGO_CONN_STRIN", process.env.MONGO_CONN_STRING);
    await connectToMongoDB();
    const songs = await Song.find();
    return songs;
  } catch (error) {
    console.error("Error getting songs from MongoDB:", error);
  } finally {
    await mongoose.disconnect();
  }
};

const compareSongs = (song1: any, song2: any) => {
  console.log('first', song1.bagpipesToPlay.length === song2.bagpipesToPlay.length)
  const bagpipesToPlay =
    song1.bagpipesToPlay.length === song2.bagpipesToPlay.length &&
    song1.bagpipesToPlay.filter(
      (bagpipe) => !song2.bagpipesToPlay.includes(bagpipe)
    ).length === 0;

  const name = song1.name === song2.name;

  const timeSignature = song1.timeSignature === song2.timeSignature;

  const labels =
    song1.labels.length === song2.labels.length &&
    song1.labels.filter((label) => !song2.labels.includes(label)).length === 0;

  return bagpipesToPlay && name && timeSignature && labels;
};

const saveUpdatedSongs = async (oldList: any[], newList: any[]) => {
  const updatedSongs = oldList
    .map((oldSong) => {
      const newSong = newList.find((newSong) => newSong.id === oldSong.id);
      if (newSong && compareSongs(oldSong, newSong)) {
        return oldSong;
      }
    })
    .filter(Boolean);
    console.log('updatedSongs', updatedSongs.length)
  // await connectToMongoDB();
  // return songsWithBagpipeTypes;
};

const saveSongsToMongoDB = async (songs: any[]) => {
  try {
    await connectToMongoDB();
    await Song.insertMany(songs);
    console.log("Songs have been saved to MongoDB.");
  } catch (error) {
    console.error("Error saving songs to MongoDB:", error);
  } finally {
    await mongoose.disconnect();
  }
};

const bagpipes = {
  bd: {
    name: "belTradDuda",
    type: "bd",
    notesMap: {
      E4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6, 8, 9],
      B4: [0, 1, 2, 3, 4, 5, 7, 8, 9],
      C5: [0, 1, 2, 3, 4, 6, 7, 8, 9],
      "C#5": [0, 1, 2, 3, 6, 7, 8, 9],
      D5: [0, 1, 2, 4, 5, 6, 7, 8, 9],
      E5: [0, 1, 3, 4, 5, 6, 7, 8, 9],
      F5: [0, 2, 3, 4, 5, 6, 7, 8, 9],
      "F#5": [2, 3, 4, 5, 6, 7, 8, 9],
    },
    holesPositions: {
      closable: [
        {
          yPos: 100,
          leftMargin: 4,
          diameter: 13.600000000000001,
        },
        {
          yPos: 116,
          leftMargin: 4,
          diameter: 13.600000000000001,
        },
        {
          yPos: 142.4,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 196,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 243.20000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 259.2,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 292.8,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 346.40000000000003,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 403.20000000000005,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 419.20000000000005,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
      ],
      linesYPositions: [
        115.60000000000001, 156.4, 210, 258.8, 306.8, 360.40000000000003, 418.8,
        456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: -21.6,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 72,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
      bg: {
        width: 441.6,
        heigth: 800,
        imageScale: 0.515,
        leftMargin: -32,
        topMargin: 0,
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      E4: 7,
      G4: 6,
      "G#4": 6,
      A4: 5,
      B4: 4,
      C5: 3,
      "C#5": 3,
      D5: 2,
      E5: 1,
      F5: 0,
      "F#5": 0,
    },
    fingersMaps: {
      E4: [0, 1, 2, 3, 4, 5, 6],
      G4: [0, 1, 2, 3, 4, 5],
      "G#4": [0, 1, 2, 3, 4, 5],
      A4: [0, 1, 2, 3, 4, 6],
      B4: [0, 1, 2, 3, 5, 6],
      C5: [0, 1, 2, 4, 5, 6],
      "C#5": [0, 1, 2, 4, 5, 6],
      D5: [0, 1, 3, 4, 5, 6],
      E5: [0, 2, 3, 4, 5, 6],
      F5: [1, 2, 3, 4, 5, 6],
      "F#5": [1, 2, 3, 4, 5, 6],
    },
  },
  bnd: {
    name: "belNonTradDuda",
    type: "bnd",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      A4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      B4: [0, 1, 2, 3, 4, 5, 6, 7],
      C5: [0, 1, 2, 3, 4, 5, 6, 8],
      "C#5": [0, 1, 2, 3, 4, 5, 8],
      D5: [0, 1, 2, 3, 4, 6, 7, 8],
      E5: [0, 1, 2, 3, 5, 6, 7, 8],
      F5: [0, 1, 2, 4, 5, 6, 7, 8],
      "F#5": [0, 1, 4, 5, 6, 7, 8],
      G5: [0, 2, 3, 4, 5, 6, 7, 8],
      A5: [1, 2, 3, 4, 5, 6, 7, 8],
    },
    holesPositions: {
      closable: [
        {
          yPos: 96,
          leftMargin: -4.800000000000001,
          diameter: 28,
        },
        {
          yPos: 116.80000000000001,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 161.60000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 177.60000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 206.4,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 249.60000000000002,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 292,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 309.6,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 336,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 380,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
      ],
      linesYPositions: [
        110, 130.8, 177.20000000000002, 220.4, 263.6, 307.6, 350, 394, 456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: -21.6,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 72,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
      bg: {
        width: 441.6,
        heigth: 800,
        imageScale: 0.515,
        leftMargin: -32,
        topMargin: 0,
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      "G#4": 8,
      A4: 7,
      B4: 6,
      C5: 5,
      "C#5": 5,
      D5: 4,
      E5: 3,
      F5: 2,
      "F#5": 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4, 6],
      "C#5": [0, 1, 2, 3, 4, 6],
      D5: [0, 1, 2, 3, 5, 6],
      E5: [0, 1, 2, 4, 5, 6],
      F5: [0, 1, 3, 4, 5, 6],
      "F#5": [0, 1, 3, 4, 5, 6],
      G5: [0, 2, 3, 4, 5, 6],
      A5: [1, 2, 3, 4, 5, 6],
    },
  },
  pl: {
    name: "polish",
    type: "pl",
    notesMap: {
      E4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6, 8, 9],
      B4: [0, 1, 2, 3, 4, 5, 7, 8, 9],
      "C#5": [0, 1, 2, 3, 6, 7, 8, 9],
      D5: [0, 1, 2, 4, 5, 6, 7, 8, 9],
      E5: [0, 1, 3, 4, 5, 6, 7, 8, 9],
      "F#5": [2, 3, 4, 5, 6, 7, 8, 9],
    },
    holesPositions: {
      closable: [
        {
          yPos: 100,
          leftMargin: 4,
          diameter: 13.600000000000001,
        },
        {
          yPos: 142.4,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 196,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 243.20000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 292.8,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 346.40000000000003,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 403.20000000000005,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
      ],
      linesYPositions: [
        106.80000000000001, 156.4, 210, 250, 306.8, 360.40000000000003, 410,
        456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 216,
        heigth: 640,
        imageScale: 0.2232142857142857,
        leftMargin: -68,
        topMargin: 0,
      },
      bg: {
        width: 329.6,
        heigth: 640,
        imageScale: 0.515,
        leftMargin: 60,
        topMargin: 80,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 45,
        notesNamesLeftMargin: 4,
        noteNameColor: "#000",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      E4: 7,
      "G#4": 6,
      A4: 5,
      B4: 4,
      "C#5": 3,
      D5: 2,
      E5: 1,
      "F#5": 0,
    },
    fingersMaps: {
      E4: [0, 1, 2, 3, 4, 5, 6],
      "G#4": [0, 1, 2, 3, 4, 5],
      A4: [0, 1, 2, 3, 4, 6],
      B4: [0, 1, 2, 3, 5, 6],
      "C#5": [0, 1, 2, 4, 5, 6],
      D5: [0, 2, 3, 4, 5, 6],
      E5: [0, 2, 3, 4, 5, 6],
      "F#5": [1, 2, 3, 4, 5, 6],
    },
  },
  bod: {
    name: "belOpenDuda",
    type: "bod",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      A4: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      B4: [0, 1, 2, 3, 4, 5, 6, 7],
      C5: [0, 1, 2, 3, 4, 5, 6],
      "C#5": [0, 1, 2, 3, 4, 5],
      D5: [0, 1, 2, 3, 4],
      E5: [0, 1, 2, 3],
      F5: [0, 1, 2],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
    holesPositions: {
      closable: [
        {
          yPos: 136,
          leftMargin: -4.800000000000001,
          diameter: 28,
        },
        {
          yPos: 156.8,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 201.60000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 217.60000000000002,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 246.4,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 289.6,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 332,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 349.6,
          leftMargin: 58.400000000000006,
          diameter: 13.600000000000001,
        },
        {
          yPos: 376,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
        {
          yPos: 420,
          leftMargin: 54.400000000000006,
          diameter: 28,
        },
      ],
      blowImage: {
        yPos: 92,
        leftMargin: 25.6,
        diameter: 24,
      },
      linesYPositions: [
        150, 170.8, 217.20000000000002, 260.40000000000003, 303.6, 347.6, 390,
        434, 456,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 320,
        heigth: 720,
        imageScale: 0.2232142857142857,
        leftMargin: 0,
        topMargin: 20,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 72,
        notesNamesLeftMargin: 32,
        noteNameColor: "#fff",
      },
      bg: {
        width: 441.6,
        heigth: 800,
        imageScale: 0.515,
        leftMargin: -32,
        topMargin: 0,
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      "G#4": 8,
      A4: 7,
      B4: 6,
      C5: 5,
      "C#5": 5,
      D5: 4,
      E5: 3,
      F5: 2,
      "F#5": 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      "G#4": [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      "C#5": [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
  },
  ddl: {
    name: "dudelsack",
    type: "ddl",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      G5: [0],
      A5: [],
    },
    holesPositions: {
      closable: [
        {
          yPos: 112,
          leftMargin: 16,
          diameter: 20,
        },
        {
          yPos: 148.8,
          leftMargin: 40,
          diameter: 20,
        },
        {
          yPos: 209.60000000000002,
          leftMargin: 42.400000000000006,
          diameter: 16,
        },
        {
          yPos: 262.40000000000003,
          leftMargin: 40,
          diameter: 20,
        },
        {
          yPos: 348.8,
          leftMargin: 40,
          diameter: 20,
        },
        {
          yPos: 393.6,
          leftMargin: 42.400000000000006,
          diameter: 16,
        },
        {
          yPos: 454.40000000000003,
          leftMargin: 40,
          diameter: 20,
        },
        {
          yPos: 496,
          leftMargin: 40,
          diameter: 20,
        },
      ],
      blowImage: {
        yPos: 72,
        leftMargin: 36,
        diameter: 26.400000000000002,
      },
      linesYPositions: [
        72, 122, 158.8, 217.60000000000002, 272.40000000000003, 358.8, 401.6,
        464.40000000000003, 506,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 160,
        heigth: 716.8000000000001,
        imageScale: 0.2232142857142857,
        leftMargin: -30.400000000000002,
        topMargin: 0,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 44,
        notesNamesLeftMargin: 4,
        noteNameColor: "#000",
      },
      bg: {
        width: 441.6,
        heigth: 800,
        imageScale: 0.515,
        leftMargin: -32,
        topMargin: 0,
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      A4: 7,
      B4: 6,
      C5: 5,
      D5: 4,
      E5: 3,
      F5: 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      C5: [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      F5: [0, 1],
      G5: [0],
      A5: [],
    },
  },
  ghb: {
    name: "highlander",
    type: "ghb",
    notesMap: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      "C#5": [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
    holesPositions: {
      closable: [
        {
          yPos: 112,
          leftMargin: 20,
          diameter: 20,
        },
        {
          yPos: 146.4,
          leftMargin: 33.6,
          diameter: 13.600000000000001,
        },
        {
          yPos: 180,
          leftMargin: 32.800000000000004,
          diameter: 16,
        },
        {
          yPos: 222.4,
          leftMargin: 32.800000000000004,
          diameter: 16,
        },
        {
          yPos: 265.6,
          leftMargin: 32.800000000000004,
          diameter: 17.6,
        },
        {
          yPos: 303.2,
          leftMargin: 32.800000000000004,
          diameter: 17.6,
        },
        {
          yPos: 355.20000000000005,
          leftMargin: 32.800000000000004,
          diameter: 20,
        },
        {
          yPos: 418.40000000000003,
          leftMargin: 32.800000000000004,
          diameter: 20,
        },
      ],
      blowImage: {
        yPos: 72,
        leftMargin: 28.8,
        diameter: 21.6,
      },
      linesYPositions: [
        72, 122, 153.20000000000002, 188, 230.4, 274.40000000000003, 312,
        365.20000000000005, 428.40000000000003,
      ],
    },
    imagesProperties: {
      main_pipe: {
        width: 216,
        heigth: 640,
        imageScale: 0.2232142857142857,
        leftMargin: -68,
        topMargin: 0,
      },
      bg: {
        width: 329.6,
        heigth: 640,
        imageScale: 0.515,
        leftMargin: 60,
        topMargin: 80,
      },
      notes: {
        lineHeight: 2,
        brickhHeight: 14.4,
        brickHeightHalf: 7.2,
        notesScale: 0.3,
        brickLeftMargin: 45,
        notesNamesLeftMargin: 4,
        noteNameColor: "#000",
      },
    },
    images: {
      mainPipe: {},
      activeHoleImage: {},
      backActiveHoleImage: {},
      closedHoleImage: {},
      backClosedHoleImage: {},
      blowImage: {},
      bgImage: {},
    },
    notesToLines: {
      G4: 8,
      A4: 7,
      B4: 6,
      "C#5": 5,
      D5: 4,
      E5: 3,
      "F#5": 2,
      G5: 1,
      A5: 0,
    },
    fingersMaps: {
      G4: [0, 1, 2, 3, 4, 5, 6, 7],
      A4: [0, 1, 2, 3, 4, 5, 6],
      B4: [0, 1, 2, 3, 4, 5],
      "C#5": [0, 1, 2, 3, 4],
      D5: [0, 1, 2, 3],
      E5: [0, 1, 2],
      "F#5": [0, 1],
      G5: [0],
      A5: [],
    },
  },
};

const getSongNotesWithOctaveFromMidi = (midi: any) => {
  const notes = midi?.tracks.filter((track: any) => track.notes.length)[0]
    .notes;
  const notesObject = {} as any;

  if (!notes) {
    return [];
  }

  notes.forEach((note: any) => {
    const noteWthOctave = note.pitch + note.octave;
    if (!(noteWthOctave in notesObject)) {
      notesObject[noteWthOctave] = noteWthOctave;
    }
  });

  return Object.keys(notesObject);
};

const bagpipeNotesMaps = Object.values([
  "bd",
  "bnd",
  "bod",
  "ddl",
  "ghb",
  "pl",
]).map((bagpipeType) => ({
  bagpipeNotes: Object.keys(bagpipes[bagpipeType].notesMap),
  bagpipeType,
}));

const findBagpipesForSong = (midi: any) => {
  const songNotesFromMidi = getSongNotesWithOctaveFromMidi(midi);

  const filteredBagpipesForSong = bagpipeNotesMaps.filter(
    ({ bagpipeNotes }) =>
      !songNotesFromMidi.filter((note) => !bagpipeNotes.includes(note)).length
  );

  const bagpipesForSong = filteredBagpipesForSong.map(
    ({ bagpipeType }) => bagpipeType
  );

  return bagpipesForSong;
};

const getSongListWithBagpipeTypes = async (songs: any): Promise<any[]> => {
  const songList = songs;
  let updatedSongList: any[] = [];
  const { Midi } = ToneJS;
  try {
    updatedSongList = await Promise.all(
      songList.map(async (song: any) => {
        const path = process.cwd();
        const buffer = fs.readFileSync(path + `/midi/${song.pathName}`);
        const midi = new Midi(buffer);

        const bagpipesToPlay = findBagpipesForSong(midi);
        if (bagpipesToPlay.includes("pl")) {
          console.log(song.name);
        }

        return { ...song, bagpipesToPlay };
      })
    );
  } catch (error: any) {
    console.log(error);
  }

  return updatedSongList;
};

const folders = [
  { path: "./midi/belarusian", label: "Belarusian" },
  { path: "./midi/irish", label: "Irish" },
  { path: "./midi/medieval", label: "Medieval" },
  { path: "./midi/balkan", label: "Balkan" },
  { path: "./midi/schotland", label: "Schotland" },
  { path: "./midi/polish", label: "Polish" },
  { path: "./midi/other", label: "Other" },
  { path: "./midi/scandinavian", label: "Scandinavian" },
  { path: "./midi/exercises", label: "Exercises" },
];

const initSongList = async () => {
  const oldList = await getSongListFromMongoDB();

  const songs: any[] = [];
  folders.forEach((folder) => {
    fs.readdirSync(folder.path).forEach((file: string) => {
      if (file.includes(".mid")) {
        const song = {} as any;
        const nameWithoutExtension = file.split(".mid").join("");
        const name = nameWithoutExtension.split("|")[0].split("$")[0];
        const timeSignature = nameWithoutExtension.split("|")[1];
        song.labels = nameWithoutExtension.split("$")[1].split("-");
        song.timeSignature = timeSignature?.split("-").join("/") || "4/4";
        song.name = name.split("-bd").join("");
        song.type = folder.label.toLowerCase();
        song.pathName = `${folder.path.split("./midi/").join("")}/${file}`;
        song.id = `${song.type}_${name.split(" ").join("-")}`;
        song.about = "";
        song.originalTempo = "";
        song.transcribedBy = "Piatro Marchanka";
        song.stats = {
          views: 0,
        };
        song.links = [];

        songs.push(song);
      }
    });
  });

  const songsWithBagpipes = await getSongListWithBagpipeTypes(songs);
  console.log("songsWithBagpipes", songsWithBagpipes.length);
  await saveUpdatedSongs(oldList, songsWithBagpipes);
  const newSongs = songsWithBagpipes.filter(
    (song: any) =>
      oldList.find((oldSong: any) => oldSong.id === song.id) === undefined
  );
  console.log("newSongs", newSongs);

  await saveSongsToMongoDB(newSongs);
};

initSongList();
