import {ref,} from 'vue';
import type {Ref} from 'vue';
import {defineStore} from 'pinia';
import type {Store} from 'pinia';
import {APP_DB_NAME} from "@/constants/constants";
import type {Profile} from "@/modules/profile/stores/Profile";
import type {ThemeTypes} from "@/modules/profile/stores/ThemeTypes";
import type {InjectionKey} from "vue";

export interface ProfileStore {
    profile: Ref<Profile | null>;
    isMinimumOneProfile: Ref<boolean>;
    createProfile: (profile: Omit<Profile, 'id'>) => Promise<void>;
    getAllProfiles: () => Promise<Profile[]>;
    deleteProfile: (id: number) => Promise<void>;
    updateProfile: (profile: Partial<Profile>) => Promise<void>;
    selectProfileById: (id: number) => void;
    selectLastCreatedProfile: () => Promise<void>;
    readPreferredLocalStorage: () => Promise<void>;
    setTheme: (theme: ThemeTypes) => void;
}
export const STORE_KEY_PROFILE: InjectionKey<Store<'profile',ProfileStore>> = Symbol('ProfileStore')


const STORE_NAME = 'profiles';
const PREFERRED_PROFILE_LOCAL_STORAGE_KEY = 'preferredProfileId';

export const useProfileStore = defineStore('profile', (): ProfileStore => {
    const profile = ref<Profile | null>(null);
    const isMinimumOneProfile = ref<boolean>(false);

    const openDb = (): Promise<IDBDatabase> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(APP_DB_NAME, 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = event => {
                const db = (event.target as IDBOpenDBRequest).result;
                db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: true});
            };
        });
    }

    const createProfile = (profile: Omit<Profile, 'id'>): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction: IDBTransaction = db.transaction(STORE_NAME, 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest = store.add(profile);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    const getAllProfiles = (): Promise<Profile[]> => {
        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction: IDBTransaction = db.transaction(STORE_NAME, 'readonly');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    const deleteProfile = (id: number): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction: IDBTransaction = db.transaction(STORE_NAME, 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest = store.delete(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    }

    const updateProfile = (updateProfileData: Partial<Profile>): Promise<void> => {
        if (!profile.value?.id) {
            return Promise.reject('Profile id is not defined');
        }

        const updatedProfile: Profile = {...profile.value, ...updateProfileData};

        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction: IDBTransaction = db.transaction(STORE_NAME, 'readwrite');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest = store.put(updatedProfile);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                if (request.result) {
                    setProfileAndVariableAfter(updatedProfile);
                }
                resolve();
            }
        });
    }

    const selectProfileById = (id: number): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction: IDBTransaction = db.transaction(STORE_NAME, 'readonly');
            const store: IDBObjectStore = transaction.objectStore(STORE_NAME);
            const request: IDBRequest = store.get(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                if (request.result) {
                    setProfileAndVariableAfter(request.result);
                } else {
                    deletePreferredLocalStorage();
                }
                resolve();
            }
        });
    }

    const selectLastCreatedProfile = (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const db: IDBDatabase = await openDb();
            const transaction = db.transaction(STORE_NAME, 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.openCursor(null, 'prev');
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    setProfileAndVariableAfter(cursor.value);
                    resolve();
                } else {
                    reject();
                }
            };
        });
    }

    const setProfileAndVariableAfter = (newProfile: Profile): void => {
        setTheme(newProfile.theme);
        profile.value = newProfile;
        setPreferredLocalStorage(newProfile.id);
        isMinimumOneProfile.value = true;
    }

    const setTheme = (theme: ThemeTypes): void => {
        if (!profile.value) {
            return;
        }

        document.querySelector(':root')?.classList.remove(profile.value.theme);
        document.querySelector(':root')?.classList.add(theme);

        profile.value.theme = theme;
    }

    const setPreferredLocalStorage = (id: number): void => {
        localStorage.setItem(PREFERRED_PROFILE_LOCAL_STORAGE_KEY, id.toString());
    }

    const deletePreferredLocalStorage = (): void => {
        localStorage.removeItem(PREFERRED_PROFILE_LOCAL_STORAGE_KEY);
    }

    const readPreferredLocalStorage = (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const id = localStorage.getItem(PREFERRED_PROFILE_LOCAL_STORAGE_KEY);
            if (id) {
                await selectProfileById(Number(id));
                resolve();
            } else {
                isMinimumOneProfile.value = false;
                reject();
            }
        });
    }

    return {
        profile,
        isMinimumOneProfile,
        setTheme,
        selectLastCreatedProfile,
        createProfile,
        getAllProfiles,
        deleteProfile,
        updateProfile,
        selectProfileById,
        readPreferredLocalStorage,
    }
})