import { readdir } from 'fs/promises';
import { join } from 'path';

export type LinkerModule = {
  name: string;
  install: () => void;
};

export function defineLinker(linker: LinkerModule): LinkerModule {
  return linker;
}

export async function LoadLinkers(
  linkerDir = join(process.cwd(), './linkers'),
  logger = console,
) {
  const linkers = (await readdir(linkerDir)).filter((file) =>
    /\.linker\.(ts|js)$/i.test(file),
  );

  await Promise.all(
    linkers
      .map(async (linkerFile) => {
        const linker = (await import(join(linkerDir, linkerFile))).default;

        if (!linker?.name) {
          throw new Error(`Linker in ${linkerFile} must have a name`);
        }
        if (!linker?.install) {
          throw new Error(
            `Linker in ${linkerFile} must have an install function`,
          );
        }

        logger.log(`Linking ${linker.name}`);
        linker.install();
        return linker;
      })
      .map((promise) =>
        promise.catch((e) => console.error('Error loading linker ', e.message)),
      ),
  );
}
