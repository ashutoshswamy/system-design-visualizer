import { NODE_H, NODE_W } from "./constants";
import type { DesignNode } from "./types";

const PADDING = 40;
const SCALE = 2;

export function slugify(name: string) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "design";
}

function boundsOf(nodes: DesignNode[]) {
  if (nodes.length === 0) return { x: 0, y: 0, width: 400, height: 300 };
  const minX = Math.min(...nodes.map((n) => n.x));
  const minY = Math.min(...nodes.map((n) => n.y));
  const maxX = Math.max(...nodes.map((n) => n.x + NODE_W));
  const maxY = Math.max(...nodes.map((n) => n.y + NODE_H));
  return {
    x: minX - PADDING,
    y: minY - PADDING,
    width: maxX - minX + PADDING * 2,
    height: maxY - minY + PADDING * 2,
  };
}

const FONT_ALIAS = "SDV Body";

/** The page's web font lives in the document, not in a detached SVG image: copy its @font-face
 * rules into the clone with the files inlined, so exported labels keep DM Sans. */
async function embeddedFontCss(sample: Element | null) {
  if (!sample) return "";
  const family = getComputedStyle(sample).fontFamily.split(",")[0].trim().replace(/^["']|["']$/g, "");
  const rules: CSSFontFaceRule[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list: CSSRuleList;
    try {
      list = sheet.cssRules;
    } catch {
      continue; // cross-origin sheet
    }
    for (const r of Array.from(list)) {
      if (r instanceof CSSFontFaceRule && r.style.getPropertyValue("font-family").replace(/["']/g, "") === family) rules.push(r);
    }
  }
  const css = await Promise.all(
    rules.map(async (r) => {
      let text = r.cssText.replace(/font-family:[^;]+;/, `font-family: "${FONT_ALIAS}";`);
      for (const [, url] of text.matchAll(/url\("?([^")]+)"?\)/g)) {
        const blob = await (await fetch(url)).blob();
        const data = await new Promise<string>((res) => {
          const fr = new FileReader();
          fr.onload = () => res(fr.result as string);
          fr.readAsDataURL(blob);
        });
        text = text.replace(url, data);
      }
      return text;
    }),
  );
  return css.join("\n");
}

export async function exportPNG(
  svgEl: SVGSVGElement,
  nodes: DesignNode[],
  filename = "design.png",
  bgColor = "#f4f5f7",
) {
  const { x, y, width, height } = boundsOf(nodes);

  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));

  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("x", String(x));
  bg.setAttribute("y", String(y));
  bg.setAttribute("width", String(width));
  bg.setAttribute("height", String(height));
  bg.setAttribute("fill", bgColor);
  clone.insertBefore(bg, clone.firstChild);

  clone.querySelectorAll(".no-export").forEach((el) => el.remove());

  const fontCss = await embeddedFontCss(svgEl.querySelector("text")).catch(() => "");
  if (fontCss) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = fontCss;
    clone.insertBefore(style, clone.firstChild);
    clone.querySelectorAll("text").forEach((t) => ((t as SVGElement).style.fontFamily = `"${FONT_ALIAS}", sans-serif`));
  }

  const svgData = new XMLSerializer().serializeToString(clone);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = svgUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = width * SCALE;
  canvas.height = height * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}
