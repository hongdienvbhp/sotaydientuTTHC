// Native page-turn animation; no proprietary flipbook assets or dependencies.
let turning=false;
function isLocalPreview(){return ['127.0.0.1','localhost'].includes(location.hostname)&&new URLSearchParams(location.search).get('preview')==='congkhai'}
function safeLink(value,local=false){
  if(typeof value!=="string"||!value.trim())return "#";
  if(local&&!/^[a-z][a-z\d+.-]*:|^[/\\]|\.\./i.test(value))return encodeURI(value);
  try{const u=new URL(value);return u.protocol==="https:"||u.protocol==="http:"?u.href:"#"}catch{return "#"}
}
function closeToc(){$("#book").classList.remove("toc-open");$("#tocToggle").setAttribute("aria-expanded","false")}
async function turnPage(direction){
  if(turning||state.detail)return;
  const next=state.page+direction,pages=Math.max(1,Math.ceil(state.filtered.length/state.perPage));
  if(next<0||next>=pages)return;
  turning=true;
  const page=$(".page-right"),reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  try{
    if(!reduce){await page.animate([{transform:"rotateY(0deg)",filter:"brightness(1)"},{transform:`rotateY(${direction>0?-75:75}deg)`,filter:"brightness(.75)"}],{duration:180,easing:"ease-in",fill:"none"}).finished;}
    state.page=next;renderList();
    if(!reduce){await page.animate([{transform:`rotateY(${direction>0?75:-75}deg)`,filter:"brightness(.75)"},{transform:"rotateY(0deg)",filter:"brightness(1)"}],{duration:240,easing:"ease-out"}).finished;}
  }finally{turning=false}
}
function bindReader(){
  $("#tocToggle").onclick=()=>{const open=$("#book").classList.toggle("toc-open");$("#tocToggle").setAttribute("aria-expanded",String(open));if(open)$("#search").focus()};
  $("#groupFilters").addEventListener("click",e=>{if(e.target.closest("button"))closeToc()});
  let start=null;
  $(".page-right").addEventListener("touchstart",e=>{if(e.target.closest("a,button,input")||state.detail)return;start={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});
  $(".page-right").addEventListener("touchend",e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)turnPage(dx<0?1:-1)},{passive:true});
}
