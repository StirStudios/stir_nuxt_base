export interface AspectRatios {
  portrait: string;
  landscape: string;
  square: string;
  fourThree: string;
}

export interface GridConfig {
  cols: Record<string, string>;
  viewCols: Record<number, string>;
  wrapCols: string;
  container: string;
  gap: string;
  viewGap: string;
}

export interface CarouselConfig {
  container: string;
  mediaHeight: string;
  mediaRounded: string;
}

export interface ScrollButtonConfig {
  base: string;
  icon: string;
  variant: string;
  showAtScrollY: number;
}

export interface StirThemeConfig {
  mediaRounded: string;
  aspectRatios: AspectRatios;
  grid: GridConfig;
  carousel: CarouselConfig;
  scrollButton: ScrollButtonConfig;
}
