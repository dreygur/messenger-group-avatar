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
    if (images.length < 3) throw new Error('Must provide at least 3 images');

    const tempPath = path.join(process.cwd(), 'temp');
    const processed = [];
    for (let i = 0; i < 3; i++) {
      processed.push(path.join(tempPath, `${process.hrtime.bigint().toString()}-${i}.jpeg`));
    }

    if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

    // Resie the images
    await resizeImage({ inImage: images[0], out: processed[0] });
    await resizeImage({ inImage: images[1], width: 225, height: 225, out: processed[1] });
    await resizeImage({ inImage: images[2], width: 225, height: 225, out: processed[2] });

    const combined = path.join(tempPath, `${process.hrtime.bigint().toString()}-combined.jpeg`);
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
