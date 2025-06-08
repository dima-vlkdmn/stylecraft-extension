const analyticsEvents = {
  colors: {
    converter: {
      colorConverted: (color: string) => ({
        category: 'ColorsConverter',
        action: 'ColorConverted',
        label: color
      }),
      colorCopied: (color: string) => ({
        category: 'ColorsConverter',
        action: 'ColorCopied',
        label: color
      }),
    },
    blender: {
      colorAddedToPalette: (color: string) => ({
        category: 'ColorsBlender',
        action: 'ColorAddedToPalette',
        label: color
      }),
      colorRemovedFromPalette: (color: string) => ({
        category: 'ColorsBlender',
        action: 'ColorRemovedFromPalette',
        label: color
      }),
      paletteRefreshed: () => ({
        category: 'ColorsBlender',
        action: 'PaletteRefreshed'
      }),
      colorCopied: (color: string) => ({
        category: 'ColorsBlender',
        action: 'ColorCopied',
        label: color
      }),
      colorsCopied: (colors: string) => ({
        category: 'ColorsBlender',
        action: 'ColorsCopied',
        label: colors
      }),
      examplePaletteSelected: (paletteName: string) => ({
        category: 'ColorsBlender',
        action: 'ExamplePaletteSelected',
        label: paletteName
      }),
    },
    gradient: {
      colorAddedToGradient: (color: string) => ({
        category: 'ColorsGradient',
        action: 'ColorAddedToGradient',
        label: color
      }),
      colorRemovedFromGradient: (color: string) => ({
        category: 'ColorsGradient',
        action: 'ColorRemovedFromGradient',
        label: color
      }),
      exampleGradientSelected: (gradientName: string) => ({
        category: 'ColorsGradient',
        action: 'ExampleGradientSelected',
        label: gradientName
      }),
      gradientCopied: (gradient: string) => ({
        category: 'ColorsGradient',
        action: 'GradientCopied',
        label: gradient
      }),
      colorCopied: (color: string) => ({
        category: 'ColorsGradient',
        action: 'ColorCopied',
        label: color
      }),
    },
  },
  images: {
    base64ToImage: {
      imageConverted: (size: string) => ({
        category: 'ImagesBase64ToImage',
        action: 'ImageConverted',
        label: size,
      }),
      imageDownloaded: (size: string) => ({
        category: 'ImagesBase64ToImage',
        action: 'ImageDownloaded',
        label: size,
      }),
    },
    imageToBase64: {
      imageConverted: (size: string) => ({
        category: 'ImagesImageToBase64',
        action: 'ImageConverted',
        label: size,
      }),
      imageCopied: (size: string) => ({
        category: 'ImagesImageToBase64',
        action: 'ImageCopied',
        label: size,
      }),
      imageCopiedToCSS: (size: string) => ({
        category: 'ImagesImageToBase64',
        action: 'ImageCopiedToCSS',
        label: size,
      }),
      imageCopiedToHTML: (size: string) => ({
        category: 'ImagesImageToBase64',
        action: 'ImageCopiedToHTML',
        label: size,
      }),
    },
    compression: {
      imageUploaded: (size: string) => ({
        category: 'ImagesCompression',
        action: 'ImageUploaded',
        label: size,
      }),
      compressionSettingsChanged: (settings: string) => ({
        category: 'ImagesCompression',
        action: 'CompressionSettingsChanged',
        label: settings,
      }),
      imageCompressed: (oprimizationPercentage: string) => ({
        category: 'ImagesCompression',
        action: 'ImageCompressed',
        label: oprimizationPercentage,
      }),
    },
  },
  games: {
    colorMatched: (level: string) => ({
      category: 'Games',
      action: 'ColorMatched',
      label: level,
    }),
    challengeStarted: () => ({
      category: 'Games',
      action: 'ChallengeStarted',
    }),
    challengeEnded: (time: string) => ({
      category: 'Games',
      action: 'ChallengeEnded',
      label: time,
    }),
    challengeScored: (score: string) => ({
      category: 'Games',
      action: 'ChallengeScored',
      label: score,
    }),
    challengeTopScored: (score: string) => ({
      category: 'Games',
      action: 'ChallengeTopScored',
      label: score,
    }),
  },
  cheatsheets: {
    characters: {
      characterCopied: (character: string) => ({
        category: 'CheatsheetsCharacters',
        action: 'CharacterCopied',
        label: character
      }),
    },
    emojis: {
      emojiCopied: (emoji: string) => ({
        category: 'CheatsheetsEmojis',
        action: 'EmojiCopied',
        label: emoji
      }),
    },
  },
};

export { analyticsEvents };
