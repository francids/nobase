import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';

async function clearDirectories() {
  const directories = ['n_data', 'n_files'];

  for (const dir of directories) {
    const path = join(process.cwd(), dir);

    if (existsSync(path)) {
      await rm(path, { recursive: true, force: true });
      console.log(`Directory ${dir} removed successfully.`);
    } else {
      console.log(`Directory ${dir} does not exist. Skipping.`);
    }
  }
}

clearDirectories().catch((error) => {
  console.error('Error occurred:', error);
  process.exit(1);
});
