import * as SecureStore from 'expo-secure-store'; import {setToken} from './api';
const KEY='life-os.access-token';
export async function restoreSession(){const t=await SecureStore.getItemAsync(KEY); setToken(t); return t}
export async function saveSession(t:string){await SecureStore.setItemAsync(KEY,t); setToken(t)}
export async function clearSession(){await SecureStore.deleteItemAsync(KEY); setToken(null)}
