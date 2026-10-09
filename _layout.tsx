import {Stack} from 'expo-router';
import {I18nProvider} from '../src/i18n';
export default function Layout(){return <I18nProvider><Stack screenOptions={{headerShown:false}}/></I18nProvider>}
