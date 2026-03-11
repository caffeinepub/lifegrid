export interface ExportColors {
  bg: string;
  cardBg: string;
  dotFill: string;
  dotEmpty: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export const DEFAULT_COLORS: ExportColors = {
  bg: "#050c1a",
  cardBg: "#0a1628",
  dotFill: "#00e5ff",
  dotEmpty: "rgba(255,255,255,0.1)",
  textPrimary: "#e8f0ff",
  textSecondary: "#6a8ab0",
  accent: "#ffd060",
};

function triggerDownload(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function exportYearProgress(
  dayOfYear: number,
  totalDays: number,
  year: number,
  colors: ExportColors = DEFAULT_COLORS,
) {
  const W = 540;
  const H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 80, 300);
  grad.addColorStop(0, `${colors.dotFill}18`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = colors.dotFill;
  ctx.font = "bold 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LifeGrid", W / 2, 70);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText(`Year Progress ${year}`, W / 2, 100);

  const pct = ((dayOfYear / totalDays) * 100).toFixed(1);
  ctx.fillStyle = colors.textPrimary;
  ctx.font = "bold 72px system-ui, sans-serif";
  ctx.fillText(`${pct}%`, W / 2, 200);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(`Day ${dayOfYear} of ${totalDays}`, W / 2, 240);

  const cols = 25;
  const dotR = 7;
  const spacing = 16;
  const gridW = cols * spacing;
  const startX = (W - gridW) / 2 + dotR;
  const startY = 300;

  for (let i = 0; i < totalDays; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = startX + col * spacing;
    const cy = startY + row * spacing;
    ctx.beginPath();
    ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
    if (i < dayOfYear) {
      ctx.fillStyle = colors.dotFill;
      ctx.shadowColor = colors.dotFill;
      ctx.shadowBlur = 6;
    } else {
      ctx.fillStyle = colors.dotEmpty;
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("lifegrid.app", W / 2, H - 40);

  triggerDownload(canvas, `lifegrid-year-${year}.png`);
}

export function exportLifeCalendar(
  weeksLived: number,
  totalWeeks: number,
  colors: ExportColors = DEFAULT_COLORS,
) {
  const W = 540;
  const H = 960;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createRadialGradient(W / 2, 80, 0, W / 2, 80, 300);
  grad.addColorStop(0, `${colors.dotFill}18`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = colors.dotFill;
  ctx.font = "bold 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LifeGrid", W / 2, 70);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "18px system-ui, sans-serif";
  ctx.fillText("Life Calendar", W / 2, 100);

  const pct = ((weeksLived / totalWeeks) * 100).toFixed(1);
  ctx.fillStyle = colors.textPrimary;
  ctx.font = "bold 60px system-ui, sans-serif";
  ctx.fillText(`${pct}%`, W / 2, 185);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText(`${weeksLived} of ${totalWeeks} weeks`, W / 2, 220);

  const cols = 52;
  const sqSize = 7;
  const gap = 2;
  const step = sqSize + gap;
  const gridW = cols * step;
  const startX = (W - gridW) / 2;
  const startY = 270;

  for (let i = 0; i < totalWeeks; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * step;
    const y = startY + row * step;
    drawRoundRect(ctx, x, y, sqSize, sqSize, 1);
    if (i < weeksLived) {
      ctx.fillStyle = colors.dotFill;
      ctx.shadowColor = colors.dotFill;
      ctx.shadowBlur = 3;
    } else {
      ctx.fillStyle = colors.dotEmpty;
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("lifegrid.app", W / 2, H - 40);

  triggerDownload(canvas, "lifegrid-life-calendar.png");
}

export function exportGoalCard(
  goalName: string,
  daysRemaining: number,
  progress: number,
  colors: ExportColors = DEFAULT_COLORS,
) {
  const W = 540;
  const H = 400;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 250);
  grad.addColorStop(0, `${colors.dotFill}15`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = colors.dotFill;
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LifeGrid · Goal", W / 2, 50);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillText(goalName, W / 2, 120);

  ctx.fillStyle = colors.accent;
  ctx.font = "bold 64px system-ui, sans-serif";
  ctx.fillText(`${daysRemaining}`, W / 2, 210);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText("days remaining", W / 2, 245);

  const barX = 60;
  const barY = 290;
  const barW = W - 120;
  const barH = 12;
  drawRoundRect(ctx, barX, barY, barW, barH, 6);
  ctx.fillStyle = colors.dotEmpty;
  ctx.fill();
  if (progress > 0) {
    drawRoundRect(ctx, barX, barY, Math.max(barH, barW * progress), barH, 6);
    ctx.fillStyle = colors.dotFill;
    ctx.shadowColor = colors.dotFill;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "14px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${(progress * 100).toFixed(0)}% elapsed`, W / 2, 330);

  triggerDownload(
    canvas,
    `lifegrid-goal-${goalName.toLowerCase().replace(/\s+/g, "-")}.png`,
  );
}

export function exportHabitCard(
  habitName: string,
  streak: number,
  last30: boolean[],
  colors: ExportColors = DEFAULT_COLORS,
) {
  const W = 540;
  const H = 400;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 250);
  grad.addColorStop(0, `${colors.accent}15`);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = colors.dotFill;
  ctx.font = "bold 20px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("LifeGrid · Habit", W / 2, 50);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = "bold 36px system-ui, sans-serif";
  ctx.fillText(habitName, W / 2, 110);

  ctx.fillStyle = colors.accent;
  ctx.font = "bold 72px system-ui, sans-serif";
  ctx.fillText(`${streak}`, W / 2, 210);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "20px system-ui, sans-serif";
  ctx.fillText("day streak", W / 2, 245);

  const dotR = 8;
  const spacing = 15;
  const total30W = 30 * spacing;
  const startX = (W - total30W) / 2 + dotR;
  const dotY = 305;

  for (let i = 0; i < 30; i++) {
    const cx = startX + i * spacing;
    ctx.beginPath();
    ctx.arc(cx, dotY, dotR, 0, Math.PI * 2);
    if (last30[i]) {
      ctx.fillStyle = colors.dotFill;
      ctx.shadowColor = colors.dotFill;
      ctx.shadowBlur = 5;
    } else {
      ctx.fillStyle = colors.dotEmpty;
      ctx.shadowBlur = 0;
    }
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = colors.textSecondary;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("last 30 days", W / 2, 335);

  triggerDownload(
    canvas,
    `lifegrid-habit-${habitName.toLowerCase().replace(/\s+/g, "-")}.png`,
  );
}
