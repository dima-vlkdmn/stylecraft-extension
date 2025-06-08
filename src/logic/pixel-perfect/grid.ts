import type {
  FullGridSettings,
  ColumnsSettings,
  GridSettings
} from '@/src/services/pixel-perfect-service/types';

let container: HTMLElement | null = null;

let settings: GridSettings = {
  full: {
    enabled:  false,
    cellSize: 50,
    unit:     'px',
    color:    'rgba(0,0,0,0.1)',
    opacity:  1,
  },
  columns: {
    enabled:   false,
    count:     12,
    gutter:    20,
    color:     'rgba(0,0,255,0.2)',
    margin:    0,
    opacity:   1,
  },
};

export function renderGrid(): void {
  container?.remove();

  if (!settings.full.enabled && !settings.columns.enabled) {
    container = null;
    return;
  }

  container = document.createElement('div');
  Object.assign(container.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '9998',
  });
  document.body.append(container);

  if (settings.full.enabled)    renderFull();
  if (settings.columns.enabled) renderColumns();
}

function renderFull(): void {
  const s = settings.full as FullGridSettings;
  const c = s.color.startsWith('rgba')
    ? s.color.replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, `rgba($1,$2,$3,${s.opacity})`)
    : s.color;
  Object.assign(container!.style, {
    backgroundImage: `
      linear-gradient(to right, ${c} 1px, transparent 1px),
      linear-gradient(to bottom, ${c} 1px, transparent 1px)
    `,
    backgroundSize: `${s.cellSize}${s.unit} ${s.cellSize}${s.unit}`,
  });
}

function renderColumns(): void {
  const s = settings.columns as ColumnsSettings & { margin: number; opacity: number };
  const vw = window.innerWidth;
  const innerW = vw - 2 * s.margin;
  const totalGutters = s.gutter * (s.count - 1);
  const colW = (innerW - totalGutters) / s.count;
  const offsetLeft = s.margin + (innerW - (colW * s.count + totalGutters)) / 2;

  for (let i = 0; i < s.count; i++) {
    const div = document.createElement('div');
    Object.assign(div.style, {
      position:       'absolute',
      top:            '0',
      left:           `${offsetLeft + i * (colW + s.gutter)}px`,
      width:          `${colW}px`,
      height:         '100%',
      backgroundColor: s.color,
      opacity:        String(s.opacity),
      pointerEvents:  'none',
    });
    container!.append(div);
  }
}

export function removeGrid(): void {
  container?.remove();
  container = null;
}

export function updateGridSettings(patch: Partial<GridSettings>): void {
  settings = {
    full:    { ...settings.full,    ...patch.full    },
    columns: { ...settings.columns, ...patch.columns },
  };
  renderGrid();
}

export function getGridSettings(): GridSettings {
  return {
    full:    { ...settings.full },
    columns: { ...settings.columns },
  };
}
