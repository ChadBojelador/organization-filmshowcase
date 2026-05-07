/**
 * optimize-posters.mjs
 * --------------------
 * Resizes & converts every poster in public/posters/ to an optimized WebP.
 *   - Originals are copied to public/posters-originals/  (one-time backup)
 *   - Optimized WebP files land in public/posters/        (same folder, .webp ext)
 *   - The original .png / .jpg files are left untouched so nothing breaks until
 *     the code references are updated.
 *
 * Usage:  node scripts/optimize-posters.mjs
 */

import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import sharp from "sharp";

const POSTERS_DIR   = join(process.cwd(), "public", "posters");
const BACKUP_DIR    = join(process.cwd(), "public", "posters-originals");
const MAX_WIDTH     = 800;   // px – more than enough for card thumbnails
const WEBP_QUALITY  = 80;    // great balance of quality vs size

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function run() {
  if (!existsSync(POSTERS_DIR)) {
    console.error("❌  Posters directory not found:", POSTERS_DIR);
    process.exit(1);
  }

  // 1 · Back up originals
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
    console.log("📁  Created backup directory:", BACKUP_DIR);
  }

  const files = readdirSync(POSTERS_DIR).filter((f) => {
    const ext = extname(f).toLowerCase();
    return IMAGE_EXTS.has(ext) && statSync(join(POSTERS_DIR, f)).isFile();
  });

  if (files.length === 0) {
    console.log("⚠️  No image files found in", POSTERS_DIR);
    return;
  }

  console.log(`\n🎬  Optimizing ${files.length} poster(s)...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const srcPath    = join(POSTERS_DIR, file);
    const backupPath = join(BACKUP_DIR, file);
    const nameNoExt  = basename(file, extname(file));
    const outPath    = join(POSTERS_DIR, `${nameNoExt}.webp`);

    // Back up if not yet backed up
    if (!existsSync(backupPath)) {
      copyFileSync(srcPath, backupPath);
    }

    const originalSize = statSync(srcPath).size;
    totalOriginal += originalSize;

    try {
      const info = await sharp(srcPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);

      totalOptimized += info.size;

      const saved = (((originalSize - info.size) / originalSize) * 100).toFixed(1);
      console.log(
        `  ✅  ${file}  →  ${nameNoExt}.webp` +
        `  (${(originalSize / 1024).toFixed(0)} KB → ${(info.size / 1024).toFixed(0)} KB,  -${saved}%)`
      );
    } catch (err) {
      console.error(`  ❌  Failed to process ${file}:`, err.message);
    }
  }

  console.log(`\n📊  Total: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB → ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`    Saved: ${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%`);
  console.log("\n✨  Done! Now update thumbnailUrl references from .png/.jpg to .webp\n");
}

run();
