import { readdir } from 'fs/promises';
import { join } from 'path';

/** A Linker definition */
export type LinkerModule = {
  /** The reference name of this Linker. */
  name: string;

  /** The setup closure of this Linker. */
  install: () => void;
};

/**
 * Defines a new Linker, given a LinkerModule object.
 * @param {LinkerModule} linker The LinkerModule object.
 * @returns {LinkerModule} The processed LinkerModule.
 *
 * @example
 * To define a basic Linker:
 * ```
 * // linkers/users.linker.ts
 * export default defineLinker({
 *   name: 'users',
 *   install() {
 *     console.log('Users Linker registered!');
 *   }
 * });
 * ```
 */
export function defineLinker(linker: LinkerModule): LinkerModule {
  return linker;
}

/**
 * Loads all Linkers from the given directory, optionally allowing you to
 * specify a custom logger.
 *
 * @param linkerDir The directory to load Linkers from.
 * @param logger The logger to use during Linker initialization.
 *
 * @example
 * To load all the linkers from the adjacent 'linkers/' directory:
 * ```
 * await LoadLinkers(path.resolve(__dirname, 'linkers'));
 * ```
 */ 
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
