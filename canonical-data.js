(function(global){
  'use strict';
  const CANONICAL_URL='https://raw.githubusercontent.com/hongdienvbhp/BangNiemYetVinhBao/main/data/thu-tuc.json';
  function validateCanonical(data){
    if(!data||data.format!=='bangniemyet-vinhbao-master-data'||data.version!==3)throw Error('Canonical TTHC không đúng contract version 3');
    if(!/^\d{4}\.\d{2}\.\d{2}$/.test(String(data.dataset_version||'')))throw Error('Canonical TTHC thiếu dataset_version hợp lệ');
    if(!/^[0-9a-f]{40}$/.test(String(data.source_commit||'')))throw Error('Canonical TTHC thiếu source_commit hợp lệ');
    if(!Array.isArray(data.thuTuc))throw Error('Canonical TTHC thiếu mảng thuTuc');
    return data.thuTuc;
  }
  function mergeCanonicalHandbookData(canonical,handbook){
    const rows=validateCanonical(canonical);
    if(!Array.isArray(handbook))throw Error('Handbook metadata không phải mảng');
    const byCode=new Map(handbook.map(x=>[String(x.code||'').trim(),x]));
    const current=rows.filter(r=>r.priority51===true&&r.daXacMinh===true).sort((a,b)=>(Number(a.priority51Ordinal)||999)-(Number(b.priority51Ordinal)||999));
    if(!current.length)throw Error('Canonical không có TTHC trọng điểm hiện hành');
    return current.map((r,index)=>{
      const local=byCode.get(String(r.ma||'').trim())||{};
      const source=Object.assign({},local.source||{}, {
        project:'BangNiemYetVinhBao',
        datasetVersion:canonical.dataset_version,
        sourceCommit:canonical.source_commit,
        snapshotDate:r.sourceSnapshotDate||'',
        verificationStatus:r.verificationStatus||r.priority51LegalVerificationStatus||'',
        publicationStatus:'canonical_current',
        articleUrl:r.sourceArticleUrl||'',
        attachmentUrl:r.sourceAttachmentUrl||''
      });
      return Object.assign({},local,{
        id:Number(local.id)||Number(r.priority51Ordinal)||index+1,
        code:r.ma,
        name:r.ten,
        field:r.linhVuc||local.field||'',
        online:r.dvcMappingSource||local.online||'',
        receivingScope:r.cap||local.receivingScope||'',
        source
      });
    });
  }
  async function loadCanonicalHandbookData(options){
    const opts=options||{};
    const canonicalUrl=opts.canonicalUrl||CANONICAL_URL;
    const localUrl=opts.localUrl||'data/procedures.json';
    const responses=await Promise.all([fetch(canonicalUrl,{cache:'no-store'}),fetch(localUrl,{cache:'no-store'})]);
    if(!responses[0].ok)throw Error('Không tải được canonical TTHC: HTTP '+responses[0].status);
    if(!responses[1].ok)throw Error('Không tải được handbook metadata: HTTP '+responses[1].status);
    const canonical=await responses[0].json();
    const handbook=await responses[1].json();
    const items=mergeCanonicalHandbookData(canonical,handbook);
    global.HANDBOOK_CANONICAL_META={datasetVersion:canonical.dataset_version,sourceCommit:canonical.source_commit,total:items.length};
    return items;
  }
  global.HANDBOOK_CANONICAL_URL=CANONICAL_URL;
  global.mergeCanonicalHandbookData=mergeCanonicalHandbookData;
  global.loadCanonicalHandbookData=loadCanonicalHandbookData;
  if(typeof module!=='undefined'&&module.exports)module.exports={CANONICAL_URL,mergeCanonicalHandbookData};
})(typeof window!=='undefined'?window:globalThis);