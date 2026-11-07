// Original vector still lifes for Bangla AI Guide. Rebuild the checked-in,
// text-free illustrations with: node scripts/generate-editorial-art.cjs
const fs = require('node:fs');
const path = require('node:path');
const {byTopic} = require('./lib/editorial-art.cjs');
const palette = {
  sage: ['#e8eedc','#cfdfa7','#71977a','#f1b784'],
  sand: ['#f3e9d6','#e7cf93','#77978a','#e49a69'],
  blue: ['#e2ece9','#c1dcd5','#7696a1','#e6ab76'],
  rose: ['#f3e5da','#efd3bf','#a07b78','#e4b365'],
  lavender: ['#ece9ed','#d9d0e0','#8e8caa','#e6ac83'],
};
const common = {ink:'#27483c',leaf:'#366750',paper:'#fffaf0',light:'#f3f1df',white:'#fffdf3'};
const p=(d,f='none',s='ink',w=1.8)=>`<path d="${d}" fill="${f}" stroke="${s}" stroke-width="${w}"/>`;
const r=(x,y,w,h,rad=2,f='paper',s='ink',sw=1.8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;
const e=(x,y,rx,ry,f='paper',s='ink',sw=1.8)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${s}" stroke-width="${sw}"/>`;
const c=(x,y,rad,f='paper',s='ink',w=1.8)=>e(x,y,rad,rad,f,s,w);
const group=(transform,svg)=>`<g transform="${transform}">${svg}</g>`;
const range=(n,fn)=>Array.from({length:n},(_,i)=>fn(i)).join('');
const lines=(x,y,n,width,step=7)=>range(n,i=>p(`M${x} ${y+i*step}h${width-(i%3)*3}`,'none','ink',1.5));
const dots=(x,y,n)=>range(n,i=>c(x+i*5,y,1.3,'leaf','none'));
const burst=(x,y,size)=>group(`translate(${x} ${y}) scale(${size})`,p('M0 -11Q1 -2 9 0Q1 2 0 11Q-2 2 -10 0Q-2 -2 0 -11Z','accent','ink',1.3));
const obj={};
// Reusable secondary objects; all use the same 100 × 100 drawing space.
obj.note = r(21,13,61,76,3,'light')+r(16,9,61,76,3)+p('M25 23h25','none','leaf',4)+lines(25,34,5,39,7)+p('M24 75q5 -12 9 -4q3 6 9 -4q-1 5 8 2','none','mid',1.7);
obj.leaf = p('M12 84Q20 41 57 10Q72 41 20 78','mid')+p('M24 75Q45 36 56 18M33 57l-4 -16m13 4l11 -4','none','paper',1.4)+p('M23 80Q44 47 82 48Q77 79 28 83','pale')+p('M18 93Q42 77 73 56M49 71l1 -9m4 6l9 1','none','ink',1.6);
obj.grain=p('M17 92Q41 58 72 12','none','leaf',3)+range(6,i=>p(`M${28+i*6} ${77-i*9}q-13 -3 -12 -17q12 3 12 17Zm2 -2q2 -13 17 -15q-2 12 -17 15Z`,i%2?'pale':'accent','ink',1.3));
obj.coin=group('rotate(-12 50 52)',e(48,62,31,18,'mid')+r(17,52,62,10,1,'accent')+e(48,52,31,17,'accent')+e(48,51,23,11,'none','ink',1.4)+p('M27 62v5m6 -3v6m7 -5v7m8 -6v7m8 -7v6m7 -8v6m7 -9v4','none','ink',1.2)+p('M43 47h13l-7 10m-6 -6h12','none','ink',2.5));
obj.pencil=group('rotate(37 50 50)',p('M44 12q6 -5 12 0v60l-6 15 -6 -15Z','accent')+p('M44 70l6 4 6 -4m-6 4v-53M44 18h12','none','ink',1.3)+p('M47.5 81l2.5 6 2.5 -6Z','ink','none'));
obj.ruler=group('rotate(38 50 50)',r(39,6,21,89,2,'accent')+range(15,i=>p(`M40 ${13+i*5}h${i%3?5:9}`,'none','ink',1.1))+c(50,87,2,'paper','ink',1));
obj.color=group('rotate(-13 50 55)',r(31,15,38,71,3,'paper')+r(35,20,30,15,1,'accent','none')+r(35,38,30,15,1,'mid','none')+r(35,56,30,15,1,'pale','none')+c(49,78,2,'ink','none'));
obj.spark=burst(40,52,2.4)+burst(68,26,.85)+burst(67,73,.65);
obj.wave=r(5,29,90,42,10,'leaf')+range(15,i=>{const h=[3,7,15,8,4,11,17,8,12,17,10,6,12,6,3][i];return p(`M${15+i*5} ${50-h}v${h*2}`,'none',i%5===0?'accent':'paper',2)});
obj.play=c(53,51,29,'accent')+p('M45 38l21 13-21 13Z','paper');
obj.cursor=p('M26 15l49 38-23 1 12 26-12 5-12-27-14 17Z','accent');
obj.list=r(12,17,76,65,4,'paper')+range(3,i=>r(21,26+i*16,9,9,1,i===2?'paper':'pale')+p(`M22 ${30+i*16}l3 3 6 -7`,'none','leaf',1.5)+p(`M39 ${30+i*16}h34`,'none','mid',2));
obj.tag=group('rotate(-15 50 50)',p('M16 35l17 -10h49v43H33L16 56Z','accent')+c(30,46,3,'paper')+p('M39 40h28m-28 10h18','none','ink',2)+p('M30 46q-21 6 -23 -6q0 -9 12 -10','none','leaf',2));
obj.box=p('M13 38l40 -17 36 15 -40 20Z','light')+p('M13 38l36 18v32L13 71Z','mid')+p('M49 56l40 -20v34L49 88Z','pale')+p('M29 30l36 17v13l8-4V43L37 27Z','accent','ink',1.2)+p('M18 61l13 6m-13 -1l8 4','none','paper',1.3);
obj.magnifier=c(43,42,25,'mid')+c(43,42,19,'pale')+p('M32 39q2 -9 12 -10','none','white',3.5)+p('M61 60l10 10','none','ink',7)+p('M65 67l6 -6 20 19q2 4-5 9Z','accent');
obj.gear=p('M45 18h11l2 10 7 3 9 -5 8 8 -5 9 3 6 10 2v11l-10 2 -3 7 5 8 -8 8 -9 -5 -7 3 -2 10H45l-2 -10 -7 -3 -9 5 -8 -8 5 -8 -3 -7 -10 -2V51l10 -2 3 -6 -5 -9 8 -8 9 5 7 -3Z','pale')+c(50,56,17,'paper')+c(50,56,7,'mid');
obj.check=c(50,50,31,'pale')+p('M35 50l10 11 22-26','none','leaf',5.5);
obj.chart=r(8,17,84,67,5,'paper')+p('M20 28v45h60','none','ink',1.6)+range(3,i=>r(27+i*16,51-i*9,10,21+i*9,1,['pale','mid','accent'][i]))+p('M23 47l12 -9 12 3 23 -15','none','leaf',2);
obj.camera=p('M8 33h18l6 -10h25l7 10h26q5 0 5 5v41H7V39q0-6 1-6Z','mid')+r(13,38,75,34,2,'leaf')+c(52,54,23,'light')+c(52,54,17,'mid')+c(52,54,12,'ink')+c(47,49,4,'paper','none')+r(15,39,10,6,1,'accent')+r(74,38,10,5,1,'paper');
obj.picture=group('rotate(-4 50 52)',r(8,15,85,67,3)+r(14,21,73,47,1,'pale')+c(65,33,8,'accent')+p('M14 62l25 -28 20 25 12-16 16 17v8H14Z','mid')+p('M14 67l27 -16 21 8 13-7 12 6v10H14Z','leaf')+dots(72,75,3));
obj.chat=r(9,18,72,38,10,'paper')+p('M22 54v9l13-9','paper')+p('M20 31h38m-38 9h27','none','leaf',3)+p('M41 54h40q8 0 8 8v14q0 7 -8 7h-1l3 8 -15 -8H41q-7 0 -7 -7V61q0 -7 7 -7Z','mid')+dots(48,69,5);
obj.pin=p('M50 82Q22 49 27 35q4 -18 23-18q22 0 23 20q1 13-23 45Z','accent')+c(50,38,9,'paper');
obj.plant=p('M35 67h37l-6 24H41Z','accent')+p('M53 67q2 -35 15 -52','none','leaf',2.5)+p('M56 47Q37 44 36 27Q54 28 56 47Zm3-7q0 -18 20 -23q1 15 -20 23Z','mid')+p('M43 75h21m-19 6h8','none','ink',1.2);
obj.bars=r(18,17,67,69,4,'light')+range(4,i=>r(26+i*12,58-i*9,8,18+i*9,1,i%2?'mid':'accent'))+p('M26 27h21','none','leaf',2);
obj.calendar=r(8,16,82,71,5,'light')+r(8,19,82,18,3,'mid')+p('M23 14v9m14 -9v9m26 -9v9m14 -9v9','none','ink',3)+range(12,i=>r(18+(i%4)*16,45+Math.floor(i/4)*12,9,6,1,i===6?'accent':i%3===0?'pale':'paper','ink',.8));
obj.book=p('M7 31q21-8 43 4q23-13 44-6v48q-21-5-44 7q-22-10-43-6Z','mid')+p('M9 23q20-7 41 8q21-15 42-10v50q-20-5-42 9q-23-12-41-8Z','paper')+p('M50 31v49','none','ink',1.5)+range(4,i=>p(`M17 ${35+i*8}q12-1 25 6m16-2q12-7 24-7`,'none','mid',1.2))+p('M68 24l8-2v20l-4-2-4 5Z','accent','ink',1);
obj.fountain=group('rotate(39 50 51)',r(44,8,14,53,4,'leaf')+r(42,52,18,9,1,'accent')+p('M44 61h14l2 11-9 19-9-19Z','light')+p('M51 69v20','none','ink',1.3)+c(51,68,2,'ink','none')+p('M47 15v30','none','pale',2));
obj.briefcase=r(34,20,32,18,5,'mid')+r(39,25,22,10,3,'paper')+r(8,35,85,49,6,'mid')+p('M8 40q1-6 8-6h68q8 0 9 6v10Q53 70 8 52Z','leaf')+r(45,51,12,12,2,'accent')+p('M15 69v9h16m54-9v9H74','none','pale',1.4);
obj.monitor=r(5,15,90,62,5,'mid')+r(10,20,80,46,2,'paper')+p('M44 77h13l3 8h10v4H31v-4h10Z','mid')+dots(45,71,3);
obj.flower=range(6,i=>group(`rotate(${60*i} 52 42)`,e(52,29,8,13,i%2?'paper':'accent')))+c(52,42,8,'pale')+p('M52 51q6 15-1 44m4-22q12-17 23-11q-9 12-23 11','none','leaf',2);
obj.ticket=group('rotate(-14 52 52)',p('M7 30h87v12q-12 5 0 13v14H7V56q11-7 0-13Z','accent')+p('M70 32v7m0 4v6m0 4v6m0 4v4','none','ink',1.2)+p('M17 44h31m-31 9h22','none','ink',2)+dots(77,52,2));
obj.glasses=c(30,50,17,'pale')+c(73,50,17,'pale')+p('M47 48q5-7 10 0M12 49l-4-8m81 8 5-10','none','ink',2.5);
// Main subjects: silhouette first, then a few deliberately exaggerated details
// that remain legible in small directory cards.
obj.cow=p('M19 42q9-12 33-7l16-1 10-8 12 4 5 13-4 9-14 1-4 13-1 17h-6l-1-14-8 1-2 12h-6l-1-13-12-1-6 15h-6l1-18-7-3-5 19h-6l4-28q-6-9 1-20','paper')+p('M17 45q-10 4-12 16l2 7m-3-1 4 1-1 6-4-1Z','mid')+p('M29 38q9-5 20 0q-1 12-10 15q-12 3-10-15Zm28 25q-4-12 4-18q8-5 14-4l-5 20Z','leaf','none')+p('M73 31q-1-8 1-12l4 9m5-1 5-9 1 12','accent')+p('M75 33q-9-7-13-3q4 9 12 8m15 4 8-1-4 9-9 1','pale')+c(83,36,1.9,'ink','none')+c(90,46,1,'ink','none');
obj.hen=p('M13 38q13 3 19 16q-2-18 4-20q9 8 10 19q11 3 17-7q1-25 13-23q10 0 12 13q3 7-3 16q-3 24-26 25q-24 2-36-15q-6-14-10-24Z','light')+p('M65 26q-4-15 3-13l6 5q-1-14 6-11l3 11q7-8 10-3q2 5-7 12Z','accent')+p('M87 34l11 5-11 4','accent')+c(80,33,1.8,'ink','none')+p('M37 55q13-5 27 2q-7 16-23 11q12-3 15-8','mid')+p('M51 76l-3 10-7 2m7-2 7 2m4-13-1 9 7 1','none','ink',2)+e(77,81,6,8,'paper');
obj.fish=p('M8 49Q38 13 73 42L94 27l-4 24 5 19-22-11Q39 86 8 52Z','mid')+p('M33 30l20-12 9 15m-15 35 14 8-2-13','accent')+p('M31 34q14 16 0 31','none','ink',1.8)+c(21,46,4,'paper')+c(21,46,1.8,'ink','none')+p('M9 52l8 2m60-3 13-15m-13 15 14 9','none','ink',1.2)+range(7,i=>p(`M${38+i%4*7} ${40+Math.floor(i/4)*10}q6 4 0 8`,'none','pale',1.6));
obj.net=group('rotate(17 51 49)',p('M24 34q9 49 26 50q16-1 27-50Z','light')+p('M30 40l31 32m-26-30 31 25m-18-25 21 16m-8-16 10 9m-1-8-27 29m16-29-20 20m6-22-11 13','none','mid',1.3)+e(51,33,28,9,'none','ink',3)+p('M78 33l17 -8','none','leaf',4));
obj.water=p('M5 52q7-9 17-2t17-2 17 0t20-2m-61 15q8-8 15-2t17-3 19 1 18-2','none','mid',3);
obj.rows=p('M3 64q23-25 52-9q27-14 43 4v22H3Z','pale')+p('M4 65q31-14 54 2t40 2M4 73q30-15 55 0t39 2','none','mid',2)+group('translate(21 -7) scale(.82)',obj.grain);
obj.scales=p('M44 77l5-58h4l6 58 13 6v4H30v-4Z','mid')+p('M10 38q13-7 37-11l5-5 6 4 26 4','none','ink',3)+c(51,19,4,'accent')+p('M15 38L4 60h25L15 38Zm65-6L67 56h26L80 32Z','none','ink',1.4)+p('M4 60h25q-11 18-25 0Zm63-4h26q-13 18-26 0Z','accent')+p('M37 83h29','none','light',1.4);
obj.steth=p('M18 17q-6 7-5 22q3 19 19 19q17-1 18-23q1-11-6-18','none','leaf',5.5)+p('M14 35q0 18 18 23q17-5 17-23','none','mid',3.3)+p('M32 58v12q0 18 17 18q15 0 18-18l3-15','none','ink',4)+c(72,44,13,'mid')+c(72,44,8,'paper')+c(18,16,3,'accent')+c(43,16,3,'accent');
obj.cross=r(18,17,66,72,4)+p('M44 28h13v12h12v13H57v12H44V53H32V40h12Z','mid')+lines(29,73,2,39,5);
obj.eye=p('M4 49Q46 7 95 49Q51 94 4 49Z','paper')+c(49,49,22,'mid')+c(49,49,10,'ink')+c(44,45,4,'paper','none')+p('M19 30l-4-6m20-2-1-6m20 4 1-7m18 13 4-7','none','ink',2);
obj.pan=p('M12 45h76l-7 31q-3 9-30 9t-31-9Z','mid')+p('M13 50H4v-7h11m72 1h9v7h-10M8 44q8-11 40-13q29-1 43 12Z','light')+r(42,25,15,6,2,'accent')+p('M30 62q2 12 6 15m8-14 1 15','none','pale',2)+p('M28 26q-7-8-1-13m12 9q-5-7 0-13m19 11q5-6 1-12','none','mid',1.8);
obj.shirt=p('M28 18l12-4q9 11 20 0l13 4 24 22-15 16-10-9v42H28V47l-10 9L3 40Z','mid')+p('M36 16q13 20 29 0m-37 64h43M9 38l12 13m58 0 12-14','none','paper',1.5)+p('M52 42h15v13l-7 5-8-5Z','pale');
obj.house=p('M9 48l40-35 43 34-9 1v35H17V48Z','paper')+p('M4 46l45-39 48 39-6 6-42-34-39 34Z','mid')+r(27,48,14,23,1,'pale')+p('M34 49v21m-6-11h12','none','ink',1)+r(54,51,16,32,1,'accent')+c(66,68,1,'ink','none')+p('M11 84h77m-58 5h51','none','leaf',1.4);
obj.map=p('M4 28l28-11 32 10 30-11v56L64 84 32 73 4 85Z','pale')+p('M32 17v56l32 11V27Z','light')+p('M8 58l22-14 17 8 17-10 25-17m-73 50 45-39m-18-9 21 18 22 11','none','mid',3.5)+p('M15 65q6-25 21-13t27 0l14-13','none','leaf',2)+c(15,65,3,'accent')+c(78,38,4,'accent');
obj.compass=c(50,53,33,'mid')+c(50,53,27,'paper')+range(12,i=>group(`rotate(${i*30} 50 53)`,p('M50 28v3','none','ink',1)))+p('M63 34l-10 22-17 17 10-24Z','accent')+p('M46 49l7 7-17 17Z','leaf')+c(50,53,2,'ink','none');
obj.passport=group('rotate(5 50 53)',r(20,11,61,78,4,'leaf')+p('M26 14v72','none','mid',1.3)+c(52,45,16,'none','pale',1.6)+e(52,45,7,16,'none','pale',1.3)+p('M36 45h32m-29-8q11 5 25 0m-24 16q11-5 23 0M35 71h32','none','pale',1.5));
obj.wheel=c(50,53,34,'leaf')+c(50,53,27,'paper')+range(10,i=>group(`rotate(${i*36} 50 53)`,p('M50 53l5-25','none','mid',1.5)))+c(50,53,5,'accent');
obj.calc=group('rotate(-6 50 52)',r(21,8,61,83,6,'mid')+r(28,17,47,18,2,'light')+p('M41 24h7v6h-7m12-6h7v6h-7m11-6h6v6h-6','none','ink',1.3)+range(12,i=>r(29+i%3*15,43+Math.floor(i/3)*10,9,6,1,i%3===2?'accent':'paper','ink',1.1)));
obj.card=group('rotate(-7 50 52)',r(5,23,89,56,5,'leaf')+r(14,33,13,10,2,'accent')+p('M16 36h9m-9 3h9','none','ink',.7)+p('M15 61h11m6 0h11m6 0h11m-44 8h21','none','paper',2)+c(76,61,7,'mid','none')+c(82,61,7,'accent','none'));
obj.shop=r(14,37,73,48,2,'light')+r(21,51,31,23,1,'mid')+r(60,50,18,35,1,'pale')+p('M15 20h70l9 19H6Z','paper')+range(6,i=>p(`M${15+i*11.6} 20h11.6l${-6+(i+1)*2} 19h-14.6Z`,i%2?'paper':'mid','ink',.9))+range(6,i=>p(`M${6+i*14.6} 39h14.6q0 13-7.3 12q-7.3 0-7.3-12Z`,i%2?'paper':'mid','ink',1.2))+p('M9 85h83','none','ink',2)+c(73,68,1.5,'ink','none');
obj.resume=r(18,8,65,82,3)+c(36,29,8,'pale')+c(36,27,3,'mid','none')+p('M30 34q6-8 12 0','mid','none')+lines(50,23,3,21,5)+p('M28 47h37','none','leaf',3)+lines(28,57,4,41,6);
obj.board=r(6,14,88,57,3,'accent')+r(11,19,78,46,1,'leaf')+p('M20 50l12-18 14 19Zm37-20h20m-20 8h14m-14 9h19','none','light',2)+p('M23 72l-5 16m58-16 6 16','none','ink',3)+r(59,61,12,3,1,'light','none');
obj.stack=p('M21 29l45-17 20 59-43 15Z','mid')+group('rotate(-7 51 52)',obj.note);
obj.face=r(12,14,74,70,5,'light')+r(18,20,62,58,2,'pale')+p('M25 76q3-18 16-21q4-3 4-10h13q0 7 7 11q12 5 12 20Z','mid')+p('M39 33q1-13 13-13q18 1 15 19l-3 10q-5 12-14 8q-10-3-11-16Z','accent')+p('M38 40q-6-17 7-20q16-6 23 6q-2 7-2 11q-4-2-8-11q-5 9-14 6l-2 8Z','leaf')+p('M49 43h1m9-1h1m-4 1 1 5h-3m-4 4q3 2 7-1','none','ink',1.3);
obj.clap=p('M8 41h85v41H8Z','mid')+group('rotate(-13 9 40)',r(8,25,84,16,1,'leaf')+range(5,i=>p(`M${13+i*16} 40l9-14h7l-9 14Z`,'paper','none')))+p('M8 43h85','none','ink',2)+p('M39 52l18 10-18 10Z','paper')+p('M66 67h15m-15 6h9','none','pale',1.4)+c(14,36,2,'accent');
obj.timeline=r(4,25,92,49,5,'paper')+range(4,i=>r(11+i*20,33,16,13,1,i%2?'pale':'mid'))+r(11,52,74,4,1,'accent','none')+r(20,60,51,4,1,'mid','none')+p('M49 30v37','none','leaf',2);
obj.bezier=r(7,15,88,69,5,'light')+dots(14,22,3)+p('M9 29h84','none','mid',1)+p('M15 70C32 65 35 36 56 40S72 64 87 47','none','leaf',3)+p('M37 35l37 10','none','mid',1.3)+c(37,35,2,'paper')+c(74,45,2,'paper')+r(52,36,8,8,0,'accent')+r(12,67,6,6,0,'pale');
obj.slides=obj.board.replace(p('M20 50l12-18 14 19Zm37-20h20m-20 8h14m-14 9h19','none','light',2),p('M30 29v14h15q-1 14-14 14q-15 0-15-14q1-13 14-14Z','pale','none')+p('M34 28q12 0 13 12H34Z','accent','none')+p('M55 32h21m-21 8h15m-15 8h19','none','paper',2));
obj.record=r(7,17,86,66,5,'mid')+r(12,22,75,52,3,'pale')+c(43,48,24,'ink')+c(43,48,19,'none','mid',1)+c(43,48,15,'none','mid',1)+c(43,48,8,'accent')+c(43,48,2,'paper')+c(76,33,4,'paper')+p('M75 34l4 19-13 7','none','paper',3)+p('M65 60l-5 3','none','ink',3.5)+dots(73,78,3);
obj.mic=group('rotate(7 50 48)',r(33,9,34,51,16,'mid')+range(5,i=>p(`M38 ${20+i*6}h24`,'none','pale',1.6))+p('M26 40v6q0 23 24 23t23-23v-6','none','ink',4)+p('M50 69v13m-16 4q16-7 32 0','none','leaf',4));
obj.type=p('M11 20h64q8 0 8 8v35q0 7-8 7H41L23 84l2-14H11q-7 0-7-7V27q0-7 7-7Z','pale')+p('M22 34h41m-10-1 1 27m-4-19q-12-11-18-2q-5 8 5 14q7 3 16-1','none','leaf',3);
obj.news=r(8,15,79,70,3,'paper')+p('M87 28h8v49q-1 8-8 8','light')+r(16,23,61,8,1,'leaf','none')+r(16,40,25,19,1,'pale')+p('M18 56l8-10 12 11Z','mid','none')+lines(47,39,5,27,5)+lines(17,68,2,56,6);
obj.horn=group('rotate(-12 50 50)',p('M24 43q25-1 47-23v57q-21-16-47-17Z','pale')+e(72,48,8,29,'mid')+r(10,43,16,18,3,'mid')+p('M28 61l8 21h9l-7-19Z','accent')+p('M83 37l8-5m-7 15h11m-10 10 8 5','none','leaf',2.5));
obj.code=obj.monitor+p('M27 33l-9 6 9 7m17-16-9 20m17-17 9 6-9 7','none','leaf',2.5)+p('M19 58h29m6 0h15','none','mid',1.5);
obj.flow=p('M20 33h26v35h33m-33-19h32','none','leaf',2.5)+r(5,20,29,23,4,'mid')+r(61,30,31,21,4,'pale')+r(61,64,31,19,4,'accent')+c(18,32,5,'paper')+p('M70 41h12m-13 32 4 3 8-7','none','leaf',2);
obj.shield=p('M50 9q16 9 37 12v28q0 24-37 43Q14 75 14 49V21q21-2 36-12Z','mid')+p('M50 16q14 8 29 10v22q-1 19-29 36q-28-16-28-36V26q15-2 28-10Z','pale')+r(35,43,30,22,3,'leaf')+p('M40 43v-7q1-14 10-13q12 0 12 13v6','none','ink',3)+c(50,52,3,'paper')+p('M50 53v5','none','paper',1.5);
obj.phone=group('rotate(-7 50 49)',r(25,5,50,88,7,'leaf')+r(30,11,40,72,3,'paper')+r(41,12,17,3,1,'mid','none')+r(34,22,31,18,2,'pale')+range(6,i=>r(35+i%3*10,48+Math.floor(i/3)*12,7,7,2,i%2?'accent':'mid','ink',.8))+p('M43 87h15','none','pale',1.5));
obj.compare=r(5,20,42,61,3,'light')+r(53,20,42,61,3,'paper')+r(10,26,31,9,1,'mid')+r(59,26,30,9,1,'accent')+range(3,i=>p(`M13 ${47+i*9}l3 3 5-6m4 3h12m25 0 3 3 5-6m4 3h11`,'none','ink',1.5));
obj.chip=range(5,i=>p(`M${31+i*10} 12v11m0 53v11M11 ${29+i*10}h12m55 0h11`,'none','ink',2))+r(22,21,57,57,6,'mid')+r(29,28,43,43,3,'pale')+p('M37 58l8-19 8 19m-13-6h10m11-12v18','none','leaf',2.7);
obj.tools=p('M14 38h73l7 12v34H7V50Z','mid')+p('M37 39V26q1-5 6-5h15q6 0 6 5v13h-7V28H44v11Z','leaf')+p('M8 53h84v15H8Z','pale')+r(21,54,10,12,2,'accent')+r(70,54,10,12,2,'accent')+p('M15 77h22m6 0h9','none','paper',1.2);
obj.banana=r(9,12,82,74,3,'paper')+r(15,18,70,53,1,'pale')+p('M22 45q11 13 28 10q15-1 23-24l4 1q2 19-11 31q-17 15-37 0q-6-5-9-14Z','accent')+p('M73 32l1-6 6-1-2 8Z','mid')+p('M28 52q19 23 39 2','none','ink',1.1)+dots(70,78,3);

// Main object, left-hand supporting object, foreground detail and paper color.
const scenes={
  cattle:['cow','rows','grain','sage'], poultry:['hen','grain','leaf','sand'],
  fishery:['fish','water','net','blue'], farming:['rows','grain','plant','sage'],
  law:['scales','stack','fountain','sand'], medicine:['steth','cross','note','rose'],
  accessibility:['eye','note','wave','lavender'], food:['pan','leaf','plant','sand'],
  apparel:['shirt','note','ruler','lavender'], building:['house','note','ruler','sand'],
  travel:['map','ticket','compass','blue'], passport:['passport','map','ticket','sage'],
  delivery:['wheel','map','box','blue'], events:['calendar','note','flower','rose'],
  accounting:['calc','stack','coin','sand'], analytics:['chart','note','bars','blue'],
  payments:['card','note','coin','sage'], shop:['shop','tag','box','sand'],
  jobs:['resume','briefcase','fountain','lavender'], classroom:['board','pencil','book','sage'],
  study:['book','note','pencil','sand'], research:['stack','book','magnifier','blue'],
  portrait:['face','picture','color','lavender'], photo:['camera','picture','color','rose'],
  'image-prompt':['banana','chat','color','sand'], image:['picture','color','spark','sage'], movies:['clap','timeline','play','lavender'],
  design:['bezier','fountain','color','rose'], slides:['slides','note','cursor','blue'],
  music:['record','wave','spark','rose'], transcript:['note','mic','wave','sage'],
  audio:['mic','wave','note','rose'], language:['type','chat','pencil','blue'],
  news:['news','note','fountain','sand'], marketing:['horn','bars','note','rose'],
  calendar:['calendar','pencil','list','sage'], writing:['note','book','fountain','sand'],
  'code-pricing':['code','card','coin','blue'],
  'copilot-credits':['chip','code','calc','lavender'],
  coding:['code','chip','cursor','blue'], automation:['flow','list','gear','sage'],
  privacy:['shield','chip','check','blue'], mobile:['phone','chat','cursor','lavender'],
  comparison:['compare','note','check','lavender'], briefcase:['briefcase','list','coin','sand'],
  prompts:['chat','note','cursor','blue'], conversation:['chat','phone','spark','sage'],
  model:['chip','chat','flow','lavender'], toolkit:['tools','gear','magnifier','sage'],
};
function illustration(subject, plate) {
  const [hero,back,detail,paletteName]=scenes[subject];
  const [base,pale,mid,accent]=palette[paletteName];
  const colors={...common,base,pale,mid,accent};
  const paint=markup=>markup.replace(/(fill|stroke)="(\w+)"/g,(_,attribute,color)=>`${attribute}="${colors[color]||color}"`);
  const pose=plate%3;
  const backGeometry=pose===0?[78,57,1.06,-11]:pose===1?[86,39,1.05,-9]:[80,60,1.06,-14];
  const foreground=pose===0?[303,93,1.03,8]:pose===1?[311,82,.99,5]:[301,96,1.04,9];
  const mainGeometry=pose===0?[158,15,1.85,-4]:pose===1?[154,16,1.83,2]:[155,15,1.85,-2];
  function place(name,[x,y,scale,angle]) {
    return group(`translate(${x} ${y}) scale(${scale}) rotate(${angle} 50 50)`,obj[name]);
  }
  const backdrop=[
    p('M89 148C90 105 151 34 218 37c61 3 87-14 135 5 48 20 54 73 15 102-35 27-46 43-118 34-63-7-94 17-137 4-15-5-24-16-24-34Z','pale','none'),
    p('M96 151c-11-31 4-80 52-100 47-18 86-3 120-16 55-21 119 12 128 62 9 52-41 86-98 84-62-3-96 13-148-1-23-6-45-13-54-29Z','pale','none'),
    p('M93 116c4-44 57-83 110-76 40 6 66-14 116-6 52 9 84 47 71 89-10 32-44 56-80 55-70-3-117 21-174 0-29-10-45-30-43-62Z','pale','none'),
  ][pose];
  const decoration=p('M51 125q26 -34 64 -31m274 -34q31 1 55 30','none','mid',1)
    .replaceAll('stroke-width="1"', 'stroke-width="1" stroke-dasharray="2 5"')
    +group('translate(99 148) rotate(-21)',r(0,0,56,30,0,'url(#hatch)','none'))
    +group('translate(352 41) rotate(-12)',r(0,0,47,24,0,'url(#hatch)','none'))
    +p('M70 62h8m-4-4v8m347 81h6m-3-3v6','none','mid',1.5)
    +burst(pose===1?119:136,pose===1?38:45,.55)+burst(400,94,.42);
  const svg=paint(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="440" viewBox="0 0 500 220" role="img" aria-labelledby="title"><title id="title">${byTopic[subject]}</title>
<defs><pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".52" fill="ink" opacity=".13"/></pattern><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M-1 3l4-4m0 4 4-4" fill="none" stroke="mid" stroke-width=".8" opacity=".48"/></pattern></defs>
<g stroke-linecap="round" stroke-linejoin="round">${r(0,0,500,220,0,'base','none')}${backdrop}${r(0,0,500,220,0,'url(#dots)','none')}
${decoration}<ellipse cx="254" cy="177" rx="117" ry="6" fill="ink" opacity=".08"/>
${place(back,backGeometry)}${place(hero,mainGeometry)}${place(detail,foreground)}
</g></svg>\n`);
  return svg;
}
if (require.main===module) {
  const root=path.join(__dirname,'..','assets','editorial');
  fs.mkdirSync(root,{recursive:true});
  for (const [n,topic] of Object.keys(byTopic).entries()) {
    if(!scenes[topic] || scenes[topic].slice(0,3).some(part=>!obj[part])) throw new Error('Incomplete illustration: '+topic);
    fs.writeFileSync(path.join(root, topic+'.svg'), illustration(topic,n),'utf8');
  }
  console.log(Object.keys(byTopic).length + ' editorial illustrations generated.');
}
