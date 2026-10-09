import type {Assessment,ScoredArea} from '../types/life';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
let token: string | null = null;
export function setToken(value:string|null){token=value}
async function request<T>(path:string, options:RequestInit={}):Promise<T>{
 const headers=new Headers(options.headers); headers.set('Content-Type','application/json'); if(token) headers.set('Authorization',`Bearer ${token}`);
 const r=await fetch(`${API_URL}${path}`,{...options,headers}); const body=await r.json().catch(()=>null); if(!r.ok) throw new Error(body?.message ?? 'Ocorreu um erro.'); return body as T;
}
export async function register(email:string,password:string,name:string){return request<{accessToken:string;user:any}>('/auth/register',{method:'POST',body:JSON.stringify({email,password,name})})}
export async function login(email:string,password:string){return request<{accessToken:string;user:any}>('/auth/login',{method:'POST',body:JSON.stringify({email,password})})}
export async function evaluateLifeMap(assessments:Assessment[]):Promise<ScoredArea[]>{return request<ScoredArea[]>('/life-map/evaluate',{method:'POST',body:JSON.stringify({assessments})})}
export async function getLatestLifeMap():Promise<ScoredArea[]>{return request<ScoredArea[]>('/life-map/latest')}
export async function getGoals(){return request<any[]>('/goals')}
export async function createGoal(data:any){return request<any>('/goals',{method:'POST',body:JSON.stringify(data)})}
export async function generateGoalPlan(id:string){return request<any[]>(`/goals/${id}/plan`,{method:'POST',body:JSON.stringify({})})}
export async function createAction(data:any){return request<any>('/actions',{method:'POST',body:JSON.stringify(data)})}
export async function getToday(){const r=await request<any>('/today'); return r.actions ?? []}
export async function completeAction(id:string,data:any){return request<any>(`/actions/${id}/complete`,{method:'PATCH',body:JSON.stringify(data)})}
export async function createCheckin(data:any){return request<any>('/checkins',{method:'POST',body:JSON.stringify(data)})}
export async function getLatestCheckin(){return request<any|null>('/checkins/latest')}

export async function getInsights(){return request<any[]>('/insights')}
export async function getWeeklyReview(){return request<any>('/weekly-review')}

export type ChatReply = {message:string; insight?:string; questions:string[]; suggested_actions:string[]; needs_confirmation:boolean; safety:'SAFE'|'CAUTION'|'HIGH_RISK'; provider:'configured-model'|'safe-fallback'};
export async function sendAIMessage(userMessage:string, relevantMemory?:Array<{category:string;content:string;userConfirmed:boolean}>){return request<ChatReply>('/ai/chat',{method:'POST',body:JSON.stringify({userMessage,relevantMemory})})}
export async function getMemories(){return request<Array<{id:string;category:string;content:string;userConfirmed:boolean;createdAt:string}>>('/memories')}
export async function saveMemory(category:string,content:string){return request<any>('/memories',{method:'POST',body:JSON.stringify({category,content,consent:true})})}
export async function deleteMemory(id:string){return request<{success:boolean}>(`/memories/${id}`,{method:'DELETE'})}

export async function exportAccountData(){return request<any>('/account/export')}
export async function deleteAccount(email:string,password:string,confirmation:string){return request<{success:boolean;deleted:boolean}>('/account',{method:'DELETE',body:JSON.stringify({email,password,confirmation})})}
