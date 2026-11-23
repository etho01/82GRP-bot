import { COMMANDS_DIR } from './const';
import fs from 'node:fs';
import path from 'node:path';

const getCommandFilesData = (dir?: string): {commandFiles: string[], commandsPath: string} => {
    const commandsPath = path.join(__dirname, dir ?? COMMANDS_DIR);
    const isProduction = process.env.NODE_ENV === 'production';
    const fileExtension = isProduction ? '.js' : '.ts';
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(fileExtension));
    return { commandFiles, commandsPath };
}

export { getCommandFilesData };