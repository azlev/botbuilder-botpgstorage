import { IBotStorage, IBotStorageContext, IBotStorageData } from 'botbuilder';

export class PGBotStorage implements IBotStorage {
    public getData(context: IBotStorageContext, callback: (err: Error, data: IBotStorageData) => void): void {
    }

    public saveData(context: IBotStorageContext, data: IBotStorageData, callback?: (err: Error) => void): void {
    }

    public deleteData(context: IBotStorageContext): void {
    }
}
