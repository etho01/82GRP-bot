import { COMMANDS_DIR } from './const';
import fs from 'node:fs';
import path from 'node:path';

const getCommandFilesData = (dir?: string): {commandFiles: string[], commandsPath: string} => {
    const commandsPath = path.join(__dirname, dir ?? COMMANDS_DIR);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
    return { commandFiles, commandsPath };
}

export { getCommandFilesData };