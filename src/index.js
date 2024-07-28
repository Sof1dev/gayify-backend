import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => c.text("hello!"));
