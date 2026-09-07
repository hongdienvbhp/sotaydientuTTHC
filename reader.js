// Native page-turn animation; no proprietary flipbook assets or dependencies.
let turning=false;
function cancelPageTurn(){turning=false;const page=$(".page-right");if(page){page.getAnimations().forEach(animation=>animation.cancel());page.classList.remove("is-turning","turn-forward","turn-back")}}
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
    if(!reduce){
      page.classList.add("is-turning",direction>0?"turn-forward":"turn-back");
      const sign=direction>0?-1:1;
      await page.animate([
        {transform:"rotateY(0deg) translateZ(0) skewY(0deg)",filter:"brightness(1)",boxShadow:"0 0 0 rgba(0,0,0,0)"},
        {transform:`rotateY(${sign*10}deg) translateZ(7px) skewY(${sign*-0.7}deg)`,filter:"brightness(.97)",boxShadow:`${sign*-12}px 8px 24px rgba(18,35,66,.18)`},
        {transform:`rotateY(${sign*38}deg) translateZ(15px) skewY(${sign*-1.3}deg)`,filter:"brightness(.84)",boxShadow:`${sign*-25}px 12px 38px rgba(18,35,66,.3)`}
      ],{duration:360,easing:"cubic-bezier(.22,.7,.24,1)",fill:"forwards"}).finished;
    }
    state.page=next;renderList();
    if(!reduce){
      const sign=direction>0?-1:1;
      await page.animate([
        {transform:`rotateY(${sign*-38}deg) translateZ(15px) skewY(${sign*1.3}deg)`,filter:"brightness(.84)",boxShadow:`${sign*25}px 12px 38px rgba(18,35,66,.3)`},
        {transform:`rotateY(${sign*-10}deg) translateZ(7px) skewY(${sign*0.7}deg)`,filter:"brightness(.97)",boxShadow:`${sign*12}px 8px 24px rgba(18,35,66,.18)`},
        {transform:"rotateY(0deg) translateZ(0) skewY(0deg)",filter:"brightness(1)",boxShadow:"0 0 0 rgba(0,0,0,0)"}
      ],{duration:420,easing:"cubic-bezier(.2,.65,.25,1)",fill:"none"}).finished;
    }
  }finally{page.classList.remove("is-turning","turn-forward","turn-back");turning=false}
}
function bindReader(){
  $("#tocToggle").onclick=()=>{const open=$("#book").classList.toggle("toc-open");$("#tocToggle").setAttribute("aria-expanded",String(open));if(open)$("#search").focus()};
  $("#groupFilters").addEventListener("click",e=>{if(e.target.closest("button"))closeToc()});
  let start=null;
  $(".page-right").addEventListener("touchstart",e=>{if(e.target.closest("a,button,input")||state.detail)return;start={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY}},{passive:true});
  $(".page-right").addEventListener("touchend",e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)turnPage(dx<0?1:-1)},{passive:true});
}
