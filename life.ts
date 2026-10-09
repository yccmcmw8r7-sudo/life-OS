export type LifeAreaId = 'RELATIONSHIPS'|'FAMILY_FRIENDS'|'EMOTIONAL_WELLBEING'|'HEALTH_ENERGY'|'FINANCES'|'CAREER'|'AUTONOMY'|'PURPOSE'|'PLEASURE'|'GROWTH';
export type Assessment = {areaId:LifeAreaId;satisfaction:number;importance:number;motivation:number;capacity:number};
export type ScoredArea = Assessment & {gap:number;gapNormalized:number;priority:number;dominoImpact:number;dominoScore:number};
export const LIFE_AREAS: {id:LifeAreaId;label:string;emoji:string}[] = [
 {id:'RELATIONSHIPS',label:'Relacionamentos e Amor',emoji:'❤️'}, {id:'FAMILY_FRIENDS',label:'Família e Amizades',emoji:'👥'}, {id:'EMOTIONAL_WELLBEING',label:'Bem-estar Emocional',emoji:'🌿'}, {id:'HEALTH_ENERGY',label:'Saúde e Energia',emoji:'⚡'}, {id:'FINANCES',label:'Finanças e Segurança',emoji:'💶'}, {id:'CAREER',label:'Carreira e Realização',emoji:'🎯'}, {id:'AUTONOMY',label:'Autonomia e Liberdade',emoji:'🕊️'}, {id:'PURPOSE',label:'Propósito e Sentido',emoji:'✨'}, {id:'PLEASURE',label:'Prazer e Experiências',emoji:'🌞'}, {id:'GROWTH',label:'Crescimento Pessoal',emoji:'🌱'}
];
