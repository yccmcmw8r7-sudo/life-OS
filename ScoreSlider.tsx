import React from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
export function ScoreSlider({label,value,onChange}:{label:string;value:number;onChange:(n:number)=>void}){
 return <View style={styles.wrap}><View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}/10</Text></View><View style={styles.buttons}>{Array.from({length:11},(_,i)=><Pressable key={i} onPress={()=>onChange(i)} style={[styles.dot,i===value&&styles.active]}><Text style={i===value?styles.activeText:styles.dotText}>{i}</Text></Pressable>)}</View></View>
}
const styles=StyleSheet.create({wrap:{marginBottom:22},row:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},label:{fontSize:15,fontWeight:'600'},value:{fontSize:15,opacity:.65},buttons:{flexDirection:'row',justifyContent:'space-between'},dot:{width:26,height:32,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:'#eee'},active:{backgroundColor:'#171717'},dotText:{fontSize:11},activeText:{fontSize:11,color:'#fff'}});
