import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image, action } = await req.json();

    let model: `${string}/${string}` | `${string}/${string}:${string}` = 
      "cjwbw/rembg:fb8af171cfa1616ddcf12428596cc2e48b7e2e0be71faae8ab2062f271154da9";
    let input: Record<string, any> = { image };

    if (action === "enhance") {
      model = "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
      input = { image, scale: 2, face_enhance: true };
    }

    const output = await replicate.run(model, { input });
    return NextResponse.json({ result: output });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
