import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const normalize=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
const text=x=>typeof x==='string'?x.trim():'';
const url=x=>{try{const u=new URL(x);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}};
export function convert(source,previous=[]){
  if(source.format==='bangniemyet-vinhbao-master-data')return convertMaster(source,previous);
  // Only explicit publication metadata is accepted; API summaries cannot prove it.
  const tables=source.tables??source.data??source;
  const rows=Array.isArray(tables)?tables:tables.procedures;
  if(!Array.isArray(rows))throw Error('Thiếu mảng procedures trong dữ liệu xuất dự án');
  const fields=new Map((tables.fields??[]).map(x=>[x.id,x.name]));
  const old=new Map(previous.map(x=>[x.code,x]));
  const seen=new Set(),items=[],excluded=[],invalid=[];
  for(const r of rows){
    const code=text(r.code),name=text(r.name);
    if(r.publication_status!=='published'||r.effect_status!=='effective'){
      excluded.push({code,reason:'Chưa công khai hoặc chưa xác nhận còn hiệu lực'});continue;
    }
    if(!code||!name||seen.has(code)){invalid.push({code,reason:'Thiếu mã/tên hoặc trùng mã'});continue}
    seen.add(code);
    const prior=old.get(code),field=text(r.fieldName)||text(fields.get(r.field_id));
    const docs=(tables.procedure_documents??[]).filter(x=>x.procedure_id===r.id);
    const steps=(tables.procedure_steps??[]).filter(x=>x.procedure_id===r.id).sort((a,b)=>a.step_no-b.step_no);
    items.push({id:prior?.id??0,code,name,field,group:field||'Chưa xác định lĩnh vực',
      level:({full:'Toàn trình',partial:'Một phần',none:'Không trực tuyến'})[r.service_level]??'',
      pdf:'',online:url(r.online_submission_url),
      search:normalize([code,name,field].join(' ')),
      source:{project:'CongkhaiTTHC',id:text(r.id),updatedAt:text(r.updated_at),publicationStatus:'published',effectStatus:'effective'},
      detail:{authority:text(r.authority_name),sequence:steps.map(x=>[text(x.title),text(x.content)].filter(Boolean).join('\n')).join('\n\n'),documents:docs.map(x=>[text(x.name),text(x.quantity),text(x.note)].filter(Boolean).join(' — ')).join('\n'),methods:text(r.methods),legal:text(r.legal_basis),processingTime:text(r.processing_time),result:text(r.result_text)}});
  }
  let next=Math.max(0,...previous.map(x=>Number(x.id)||0))+1;
  for(const x of items)if(!x.id)x.id=next++;
  const current=new Set(items.map(x=>x.code));
  return {items,report:{inputCount:rows.length,eligibleCount:items.length,excluded,invalid,
    added:items.filter(x=>!old.has(x.code)).map(x=>x.code),
    changed:items.filter(x=>old.has(x.code)&&JSON.stringify(x)!==JSON.stringify(old.get(x.code))).map(x=>x.code),
    absentFromEligibleSource:previous.filter(x=>!current.has(x.code)).map(x=>x.code),
    warning:'Bản xem trước; không tự xóa, công khai hoặc thay dữ liệu hiện hành. PDF cũ không tự ghép với nội dung mới.'}};
}
export function convertMaster(source,previous=[]){
  if(!Array.isArray(source.thuTuc))throw Error('Thiếu thuTuc');
  const allowed=new Set(['official_city_decision_commune_reception','official_commune_evidence_no_later_repeal_in_snapshot']);
  const verified=source.thuTuc.filter(r=>r.daXacMinh===true&&allowed.has(r.verificationStatus)&&url(r.sourceAttachmentUrl));
  // These flags are used only for the internal converter. The output is explicitly pending approval.
  const mapped=verified.map(r=>({id:r.ma,code:r.ma,name:r.ten,fieldName:r.linhVuc,publication_status:'published',effect_status:'effective',authority_name:r.coQuan,processing_time:r.thoiHan,legal_basis:r.quyetDinh,updated_at:r.sourceSnapshotDate}));
  const result=convert({procedures:mapped},previous),byCode=new Map(verified.map(r=>[r.ma,r]));
  for(const x of result.items){const r=byCode.get(x.code);x.source={project:'CongkhaiTTHC',snapshotDate:r.sourceSnapshotDate,verificationStatus:r.verificationStatus,publicationStatus:'pending_approval',articleUrl:url(r.sourceArticleUrl),attachmentUrl:url(r.sourceAttachmentUrl)};x.receivingScope=text(r.cap);x.detail.note='Bản xem trước từ dữ liệu dự án; chưa phê duyệt công khai trên sổ tay.';}
  result.report.inputCount=source.thuTuc.length;
  result.report.excluded=source.thuTuc.filter(r=>!verified.includes(r)).map(r=>({code:r.ma,reason:'Chưa đủ dấu vết xác minh nguồn'}));
  result.report.sourceFormat=source.format;result.report.publicationStatus='pending_approval';
  return result;
}
export function run(input,output){
  if(!input||!output)throw Error('Dùng: node tools/sync-congkhai.mjs <export.json> <thư-mục-xem-trước-mới>');
  const target=path.resolve(output),sourcePath=path.resolve(input);
  if(fs.existsSync(target))throw Error('Thư mục đầu ra phải mới để không ghi đè');
  const raw=fs.readFileSync(sourcePath,'utf8');
  const previous=JSON.parse(fs.readFileSync(new URL('../data/procedures.json',import.meta.url),'utf8'));
  const result=convert(JSON.parse(raw.replace(/^\uFEFF/,'')),previous);
  result.report.sourceSha256=crypto.createHash('sha256').update(raw).digest('hex');
  result.report.generatedAt=new Date().toISOString();
  fs.mkdirSync(target,{recursive:true});
  fs.writeFileSync(path.join(target,'report.json'),JSON.stringify(result.report,null,2));
  if(!result.items.length||result.report.invalid.length)throw Error('Chưa tạo ứng viên: nguồn không có bản công khai còn hiệu lực hoặc có dữ liệu lỗi. Xem report.json');
  fs.writeFileSync(path.join(target,'procedures.candidate.json'),JSON.stringify(result.items,null,2));
  console.log(JSON.stringify({eligibleCount:result.items.length,report:path.join(target,'report.json')}));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){try{run(process.argv[2],process.argv[3])}catch(e){console.error(e.message);process.exitCode=1}}
