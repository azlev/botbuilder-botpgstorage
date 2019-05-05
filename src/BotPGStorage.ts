import { IBotStorage, IBotStorageContext, IBotStorageData } from 'botbuilder';
import { Client } from 'ts-postgres';

/**
 * CREATE TABLE botstorage (
 *   id varchar(255) PRIMARY KEY,
 *   data_type TEXT NOT NULL,
 *   data TEXT,
 *   compressed BOOLEAN NOT NULL DEFAULT FALSE,
 *   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP);
 */
export class BotPGStorage implements IBotStorage {
    private client: Client;

    constructor() {
        this.client = new Client();
        this.client.connect();
    }

    public getData(context: IBotStorageContext, callback: (err: Error, data: IBotStorageData) => void): void {
        let pdata = this._foo(context);
        pdata.then(data => callback(null, data));
    }



    public saveData(context: IBotStorageContext, data: IBotStorageData, callback ?: (err: Error) => void): void {
        const query = 'INSERT INTO botstorage (id, data_type, data) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT botstorage_pkey DO UPDATE SET data = $3, updated_at = CURRENT_TIMESTAMP';
        this.client.query(query, [context.userId, 'userData', JSON.stringify(data.userData) || '{}' ]);
        this.client.query(query, [context.userId, 'privateConversationData', JSON.stringify(data.privateConversationData) || '{}' ]);
        this.client.query(query, [context.userId, 'conversationData', JSON.stringify(data.conversationData) || '{}' ]);
        callback(null);
    }

    // public deleteData(context: IBotStorageContext): void {  }

    private async _foo(context: IBotStorageContext): Promise<IBotStorageData> {
        const data: IBotStorageData = {};
        const query = 'SELECT data FROM botstorage WHERE id = $1 AND data_type = $2';
        let result = this.client.query(query, [context.userId, 'userData']);
        for await (const row of result)  {
            data.userData = JSON.parse(row.get('data').toString());
        }

        result = this.client.query(query, [context.userId, 'privateConversationData']);
        for await (const row of result) {
            data.privateConversationData = JSON.parse(row.get('data').toString());
        }

        result = this.client.query(query, [context.userId, 'conversationData']);
        for await (const row of result) {
            data.conversationData = JSON.parse(row.get('data').toString());
        }
        return data;
    }
}
