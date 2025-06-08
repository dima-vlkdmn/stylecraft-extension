export interface CategorizedPalette {
  backgroundColors: string[];
  textColors:       string[];
  borderColors:     string[];
  additionalColors: string[];
  actionColors:     string[];
}

export interface PaletteState {
  palette: CategorizedPalette | null;
}
