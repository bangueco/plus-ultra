const NativePaperDark = {
  dark: true,
  mode: 'adaptive',
  colors: {
    primary: "rgb(103, 211, 255)",
    onPrimary: "rgb(0, 53, 70)",
    primaryContainer: "rgb(0, 77, 100)",
    onPrimaryContainer: "rgb(189, 233, 255)",
    secondary: "rgb(233, 179, 255)",
    onSecondary: "rgb(75, 23, 99)",
    secondaryContainer: "rgb(99, 48, 124)",
    onSecondaryContainer: "rgb(247, 216, 255)",
    tertiary: "rgb(187, 195, 255)",
    onTertiary: "rgb(23, 39, 120)",
    tertiaryContainer: "rgb(49, 63, 144)",
    onTertiaryContainer: "rgb(222, 224, 255)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(25, 28, 30)",
    onBackground: "rgb(225, 226, 228)",
    surface: "rgb(25, 28, 30)",
    onSurface: "rgb(225, 226, 228)",
    surfaceVariant: "rgb(64, 72, 76)",
    onSurfaceVariant: "rgb(192, 200, 205)",
    outline: "rgb(138, 146, 151)",
    outlineVariant: "rgb(64, 72, 76)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(225, 226, 228)",
    inverseOnSurface: "rgb(46, 49, 50)",
    inversePrimary: "rgb(0, 102, 132)",
    elevation: {
      level0: "transparent",
      level1: "rgb(29, 37, 41)",
      level2: "rgb(31, 43, 48)",
      level3: "rgb(34, 48, 55)",
      level4: "rgb(34, 50, 57)",
      level5: "rgb(36, 54, 62)"
    },
    surfaceDisabled: "rgba(225, 226, 228, 0.12)",
    onSurfaceDisabled: "rgba(225, 226, 228, 0.38)",
    backdrop: "rgba(42, 49, 54, 0.4)"
  }
}

const NativePaperLight = {
  dark: false,
  colors: {
    primary: "rgb(0, 102, 132)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(189, 233, 255)",
    onPrimaryContainer: "rgb(0, 31, 42)",
    secondary: "rgb(125, 73, 150)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(247, 216, 255)",
    onSecondaryContainer: "rgb(49, 0, 72)",
    tertiary: "rgb(74, 88, 169)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(222, 224, 255)",
    onTertiaryContainer: "rgb(0, 15, 92)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(251, 252, 254)",
    onBackground: "rgb(25, 28, 30)",
    surface: "rgb(251, 252, 254)",
    onSurface: "rgb(25, 28, 30)",
    surfaceVariant: "rgb(220, 228, 233)",
    onSurfaceVariant: "rgb(64, 72, 76)",
    outline: "rgb(112, 120, 125)",
    outlineVariant: "rgb(192, 200, 205)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(46, 49, 50)",
    inverseOnSurface: "rgb(239, 241, 243)",
    inversePrimary: "rgb(103, 211, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(238, 245, 248)",
      level2: "rgb(231, 240, 244)",
      level3: "rgb(223, 236, 241)",
      level4: "rgb(221, 234, 239)",
      level5: "rgb(216, 231, 237)"
    },
    surfaceDisabled: "rgba(25, 28, 30, 0.12)",
    onSurfaceDisabled: "rgba(25, 28, 30, 0.38)",
    backdrop: "rgba(42, 49, 54, 0.4)"
  }
}

const ReactNavigationDark = {
  dark: true,
  colors: {
    primary: 'rgb(103, 211, 255)',
    background: 'rgb(25, 28, 30)',
    card: '#2C2C2C',
    text: '#E0E0E0',
    border: '#333333',
    notification: '#FF6F61',
  },
}

const ReactNavigationLight = {
  dark: false,
  colors: {
    primary: 'rgb(0, 102, 132)',
    background: 'rgb(251, 252, 254)',
    card: '#FFFFFF',
    text: '#333333',
    border: '#D1E1F0',
    notification: '#FF5733',
  },
}

export {
  NativePaperDark, 
  NativePaperLight,
  ReactNavigationDark,
  ReactNavigationLight
}