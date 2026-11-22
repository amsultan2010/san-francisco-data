import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const distDir = path.resolve("dist");
const serverEntry = pathToFileURL(path.join(distDir, "server/entry-server.js")).href;

const { render } = await import(serverEntry);
const appHtml = render();

const indexPath = path.join(distDir, "index.html");
const template = fs.readFileSync(indexPath, "utf8");
const rendered = template.replace("<!--app-html-->", appHtml);

fs.writeFileSync(indexPath, rendered, "utf8");
fs.rmSync(path.join(distDir, "server"), { recursive: true, force: true });
console.log("Prerendered dist/index.html (" + appHtml.length + " bytes of HTML)");
