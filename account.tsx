import {isRTL} from '../src/i18n/locale';
import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View, ActivityIndicator} from 'react-native';
import {router} from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {useI18n} from '../src/i18n';
import {screenText} from '../src/i18n/screens';
import {deleteAccount, exportAccountData} from '../src/lib/api';
import {clearSession} from '../src/lib/session';

export default function AccountScreen(){
 const {language}=useI18n(); const tx=(key:string)=>screenText(language,key);
 const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [confirmation,setConfirmation]=useState('');
 const [exporting,setExporting]=useState(false); const [deleting,setDeleting]=useState(false);
 async function exportData(){
  if(exporting)return;
  setExporting(true);
  let exportUri:string|undefined;
  try{
   const data=await exportAccountData();
   const stamp=new Date().toISOString().replace(/[:.]/g,'-');
   const base=FileSystem.cacheDirectory??FileSystem.documentDirectory;
   if(!base)throw new Error('No writable app directory is available.');
   exportUri=`${base}life-os-export-${stamp}.json`;
   await FileSystem.writeAsStringAsync(exportUri,JSON.stringify(data,null,2),{encoding:FileSystem.EncodingType.UTF8});
   if(await Sharing.isAvailableAsync()){
    await Sharing.shareAsync(exportUri,{mimeType:'application/json',dialogTitle:'LIFE OS data export',UTI:'public.json'});
   }else{
    await Share.share({title:'LIFE OS data export',message:JSON.stringify(data,null,2)});
   }
  }catch{Alert.alert(tx('accountTitle'),tx('exportError'))}
  finally{if(exportUri){try{await FileSystem.deleteAsync(exportUri,{idempotent:true})}catch{}}setExporting(false)}
 }
 async function removeAccount(){if(confirmation!=='DELETE MY ACCOUNT'){Alert.alert(tx('accountTitle'),tx('typeDelete'));return}if(!email.trim()||!password)return;setDeleting(true);try{await deleteAccount(email,password,confirmation);await clearSession();Alert.alert(tx('deletedTitle'),tx('deletedBody'),[{text:'OK',onPress:()=>router.replace('/') }]);}catch{Alert.alert(tx('accountTitle'),tx('deleteError'))}finally{setDeleting(false)}}
 return <ScrollView contentContainerStyle={[s.page,{direction:isRTL(language)?'rtl':'ltr'}]}><Pressable onPress={()=>router.back()}><Text style={s.back}>‹ {tx('back')}</Text></Pressable><Text style={s.eyebrow}>{tx('accountEyebrow')}</Text><Text style={s.title}>{tx('accountTitle')}</Text><Text style={s.body}>{tx('accountBody')}</Text>
 <View style={s.card}><Text style={s.cardTitle}>{tx('exportData')}</Text><Text style={s.bodySmall}>{tx('exportReady')}</Text><Pressable disabled={exporting} onPress={exportData} style={s.button}>{exporting?<ActivityIndicator color="#fff"/>:<Text style={s.buttonText}>{tx('exportData')}</Text>}</Pressable></View>
 <View style={s.danger}><Text style={s.dangerTitle}>{tx('deleteAccount')}</Text><Text style={s.bodySmall}>{tx('deleteWarning')}</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder={tx('emailConfirm')} style={s.input}/><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder={tx('passwordConfirm')} style={s.input}/><TextInput value={confirmation} onChangeText={setConfirmation} autoCapitalize="characters" placeholder={tx('typeDelete')} style={s.input}/><Pressable disabled={deleting||!email.trim()||!password||confirmation!=='DELETE MY ACCOUNT'} onPress={removeAccount} style={[s.deleteButton,(deleting||!email.trim()||!password||confirmation!=='DELETE MY ACCOUNT')&&s.disabled]}>{deleting?<ActivityIndicator color="#fff"/>:<Text style={s.buttonText}>{tx('confirmDelete')}</Text>}</Pressable></View>
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:24,paddingTop:58,backgroundColor:'#faf9f6',flexGrow:1},back:{fontSize:16,fontWeight:'600',marginBottom:22},eyebrow:{letterSpacing:2,fontSize:11,fontWeight:'700',opacity:.55},title:{fontSize:32,fontWeight:'700',marginTop:10},body:{fontSize:15,lineHeight:23,opacity:.7,marginTop:10,marginBottom:18},card:{backgroundColor:'#fff',padding:18,borderRadius:16,marginBottom:18},cardTitle:{fontSize:20,fontWeight:'700'},bodySmall:{fontSize:14,lineHeight:21,opacity:.7,marginTop:8},button:{backgroundColor:'#171717',padding:14,borderRadius:12,alignItems:'center',marginTop:14},buttonText:{color:'#fff',fontWeight:'700'},danger:{borderWidth:1,borderColor:'#e4baba',backgroundColor:'#fffafa',padding:18,borderRadius:16},dangerTitle:{fontSize:20,fontWeight:'700',color:'#8d2020'},input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e2dc',borderRadius:11,padding:13,fontSize:15,marginTop:10},deleteButton:{backgroundColor:'#9b2020',padding:14,borderRadius:12,alignItems:'center',marginTop:14},disabled:{opacity:.4}});
