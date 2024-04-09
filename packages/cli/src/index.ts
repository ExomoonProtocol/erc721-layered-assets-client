import { GenThumbnailsCommand } from "./commands/GenThumbnailsCommand";

async function run() {
  const command = new GenThumbnailsCommand();
  await command.run();
}

run();
