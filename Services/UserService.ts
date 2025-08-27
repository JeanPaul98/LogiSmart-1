// src/server/storage.sequelize.ts
import { Op } from "sequelize";
import {
    User as UserModel,
} from "../Models";

import {
    type User,
    type UpsertUser,
} from "@shared/schema";

import { IStorage } from "../Interface/IStorage";
import { IUser } from "Interface/IUser";

// Petite aide pour convertir proprement vers number (évite NaN)
const toNum = (v: number | string) => {
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isNaN(n)) throw new Error(`Invalid numeric id: ${v}`);
    return n;
};

export class UserService implements IUser {

    // USERS
    async getUser(id: string): Promise<User | undefined> {
        const u = await UserModel.findByPk(id);
        return u?.toJSON() as User | undefined;
    }

    async upsertUser(userData: UpsertUser): Promise<User> {
        // MySQL n’utilise pas réellement `returning`. Sequelize fera un select ensuite si besoin.
        const [u] = await UserModel.upsert({ ...userData });
        // Selon le dialecte, upsert peut retourner l’instance ou pas. On sécurise :
        if (!u) {
            // fallback: relire
            const reread = await UserModel.findByPk(userData.id);
            if (!reread) throw new Error("Failed to upsert user");
            return reread.toJSON() as User;
        }
        return u.toJSON() as User;
    }
}

export const user = new UserService();
