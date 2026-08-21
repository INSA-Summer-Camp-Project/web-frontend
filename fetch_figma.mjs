import fs from "fs";

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error("FIGMA_TOKEN environment variable is required");
  process.exit(1);
}

try {
  const res = await fetch(
    "https://api.figma.com/v1/files/F453cn9EMAfH6wiC7y0H2w",
    {
      headers: {
        "X-Figma-Token": token,
      },
    },
  );
  const data = await res.json();
  fs.writeFileSync("figma_file.json", JSON.stringify(data, null, 2));
  console.log("Fetched!");
} catch (e) {
  console.error(e);
}
