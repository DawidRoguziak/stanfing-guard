


//
//     it('should have default state', async () => {
//         const store = useProfileStore();
//         expect(store.profile).toBeNull();
//         expect(store.isMinimumOneProfile).toBeFalsy();
//     });
//

//
//     it('selectLastCreatedProfile should select profile', async () => {
//         const store = useProfileStore();
//         await store.selectLastCreatedProfile();
//
//         expect(store.profile).not.toBeNull();
//     });
//
//     it('selectProfileById should select profile', async () => {
//         const store = useProfileStore();
//         await store.selectProfileById(1);
//
//         expect(store.profile).not.toBeNull();
//         expect(store.profile?.id).toEqual(1);
//     });
//
//     it(' should update active profile', async () => {
//         const store = useProfileStore();
//         await store.selectLastCreatedProfile();
//         await store.updateProfile({name: 'test 2'});
//
//         expect(store.profile).not.toBeNull();
//         expect(store.profile?.name).toEqual('test 2');
//     });
//
//     it('if profile is selected, isMinimumOneProfile should be true', async () => {
//         const store = useProfileStore();
//         await store.selectLastCreatedProfile();
//
//         expect(store.isMinimumOneProfile).toBeTruthy();
//     });
//
//     it('should get profile list ', async () => {
//         const store = useProfileStore();
//         const profiles = await store.getAllProfiles();
//
//         expect(profiles.length).toBeGreaterThanOrEqual(1);
//     });
//
//     it('should set theme from profile', async () => {
//         const store = useProfileStore();
//         await store.selectLastCreatedProfile();
//
//         store.setTheme('dark');
//         expect(store.profile?.theme).toBe('dark');
//         store.setTheme('light');
//         expect(store.profile?.theme).toBe('light');
//     });
//

//
//     it('should delete profile', async () => {
//         const store = useProfileStore();
//         await store.selectLastCreatedProfile();
//         await store.deleteProfile(1);
//
//         openDb().then((db: IDBDatabase) => {
//             const transaction: IDBTransaction = db.transaction(DB_STORE_NAME_PROFILE, 'readonly');
//             const objStore: IDBObjectStore = transaction.objectStore(DB_STORE_NAME_PROFILE);
//
//             objStore.getAll().onsuccess = function () {
//                 expect(this.result).toHaveLength(0);
//             }
//         });
//     });
