import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService {
    constructor() {}

    async getData(key: string): Promise<string|null> {
        try {
            const value: string|null = await AsyncStorage.getItem(key);
            if(value !== null) {
                return value;
            }
        } catch(e: any) {
            console.error(e);
        }
        return null;
    };

    async storeData(key: string, value: string): Promise<void> {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (e: any) {
            console.error(e);
        }
    };
}
