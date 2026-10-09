import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {LANGUAGES, LanguageCode, messages} from './messages';

type I18nValue = {language: LanguageCode; setLanguage:(language:LanguageCode)=>Promise<void>; t:(key:string)=>string; languages:typeof LANGUAGES};
const I18nContext=createContext<I18nValue>({language:'en',setLanguage:async()=>{},t:(key)=>messages.en[key]??key,languages:LANGUAGES});
function deviceLanguage():LanguageCode {
  try { const locale=Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase(); const code=locale.split(/[-_]/)[0]; return LANGUAGES.some(x=>x.code===code)?code as LanguageCode:'en'; } catch { return 'en'; }
}
export function I18nProvider({children}:{children:React.ReactNode}) {
  const [language,setLanguageState]=useState<LanguageCode>(deviceLanguage());
  useEffect(()=>{SecureStore.getItemAsync('lifeos.language').then(value=>{if(value&&LANGUAGES.some(x=>x.code===value))setLanguageState(value as LanguageCode)}).catch(()=>{});},[]);
  const setLanguage=async(next:LanguageCode)=>{setLanguageState(next);try{await SecureStore.setItemAsync('lifeos.language',next)}catch{}};
  const value=useMemo(()=>({language,setLanguage,t:(key:string)=>messages[language]?.[key]??messages.en[key]??messages.pt[key]??key,languages:LANGUAGES}),[language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n(){return useContext(I18nContext)}
