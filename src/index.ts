import sharp from "sharp";
import fs from "fs";
import path from "path";

export interface ResizeType {
  width?: number;
  height?: number;
  out?: string;
  inImage?: string;
}

async function resizeImage({ width = 450, height = 450, out = '', inImage = '' }: ResizeType | any) {
  try {
    await sharp(inImage)
      .resize({
        width,
        height
      })
      .toFormat('jpeg')
      .jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4',
        force: true,
      })
      .toFile(out);
  } catch (error) {
    console.log(error);
  }
}

export default async function makeCombined(...images: string[]): Promise<string> {
  try {
    if (images.length < 2) throw new Error('Must provide at least 2 images');
    if (images.length > 3) images = images.splice(2);

    const tempPath = path.join(process.cwd(), 'temp');
    const processed = [];
    for (let i = 0; i < images.length; i++) {
      processed.push(path.join(tempPath, `${process.hrtime.bigint().toString()}-${i}.jpeg`));
    }

    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

    // Resie the images
    let combined = path.join(tempPath, `${process.hrtime.bigint().toString()}-combined.jpeg`);
    if (images.length < 3) {
      for (let i in images) {
        await resizeImage({ inImage: images[parseInt(i)], out: processed[parseInt(i)] });
      }
      await sharp(processed[0])
        .composite([
          {
            input: processed[1],
            top: 0,
            left: 225,
          }
        ])
        .toFile(combined);
    } else {
      for (let i in images) {
        let j: number = parseInt(i);
        if (j === 0) {
          await resizeImage({ inImage: images[i], out: processed[i] });
          continue;
        }
        await resizeImage({ inImage: images[j], width: 225, height: 225, out: processed[j] });
      }

      await sharp(processed[0])
        .composite([
          {
            input: processed[1],
            top: 0,
            left: 225,
          },
          {
            input: processed[2],
            top: 225,
            left: 225,
          },
        ])
        .toFile(combined);
    }

    // Delete temporary files
    try {
      processed.forEach(image => fs.rmSync(image));
    } catch (_) {
      console.log('Files already deleted')
    }

    return combined;
  } catch (e) {
    throw e;
  }
}
