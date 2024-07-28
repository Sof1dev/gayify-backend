import { handle } from "hono/aws-lambda";
import { Hono } from "hono";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:4321"],
  })
);

const DEFAULT_TRANSPARENCY = 40;
const FLAGS = ["lgbt", "trans", "enby", "lesbian", "gay"];
app.get("/", async (c) => c.text("hello!"));
app.post("/api/gayify", async (c) => {
  const formData = await c.req.formData();

  const file = formData.get("file");
  const selectedFlag = formData.get("flag");

  let transparency;
  try {
    transparency = Number.parseInt(
      formData.get("transparency")?.toString() || ""
    );

    if (transparency > 100 || transparency <= 0) {
      transparency = DEFAULT_TRANSPARENCY;
    }
  } catch {
    transparency = DEFAULT_TRANSPARENCY;
  }

  const sharpFile = sharp(await file.arrayBuffer());

  let fileMetadata;

  try {
    fileMetadata = await sharpFile.metadata();
  } catch {
    return new Response("", {
      status: 400,
    });
  }

  if (!FLAGS.includes(selectedFlag)) {
    return c.text("Error, flag doesn't exist", 400);
  }

  const flagPath = path.join(
    process.cwd(),
    "flags/",
    `${selectedFlag}_flag.webp`
  );

  const flag = fs.readFileSync(flagPath);

  const resizedFlag = await sharp(flag)
    .resize({
      height: fileMetadata.height,
      width: fileMetadata.width,
      fit: "fill",
    })
    .ensureAlpha(transparency / 100)
    .toBuffer();

  const outputBuffer = await sharp(await file.arrayBuffer())
    .composite([
      {
        input: resizedFlag,
        blend: "over",
      },
    ])
    .sharpen()
    .toFormat("webp")
    .toBuffer();

  c.header("Content-Type", "image/webp");
  return c.body(outputBuffer);
});

export const handler = handle(app);
