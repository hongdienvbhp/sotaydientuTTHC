import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {mergeCanonicalHandbookData}=require('../canonical-data.js');
const commit='d720f07659f8571e03f16ecdb3cc914598550c57';
const base={format:'bangniemyet-vinhbao-master-data',version:3,dataset_version:'2026.09.18',source_commit:commit,thuTuc:[
  {ma:'1.000001',ten:'Tên canonical',linhVuc:'LĨNH VỰC',priority51:true,priority51Ordinal:1,daXacMinh:true,cap:'Xã',dvcMappingSource:'https://dichvucong.gov.vn/a',sourceSnapshotDate:'2026-09-18',verificationStatus:'priority51_current_official_commune_evidence'},
  {ma:'2.000002',ten:'Không trọng điểm',priority51:false,daXacMinh:true},
]};
test('runtime chỉ hiển thị priority current từ canonical và giữ metadata Sổ tay',()=>{
  const result=mergeCanonicalHandbookData(base,[{id:9,code:'1.000001',name:'Tên cũ',group:'Nhóm',pdf:'a.pdf',detail:{legal:'Chi tiết'}},{id:10,code:'9.999999',name:'Local only'}]);
  assert.equal(result.length,1); assert.equal(result[0].id,9); assert.equal(result[0].name,'Tên canonical'); assert.equal(result[0].pdf,'a.pdf'); assert.equal(result[0].detail.legal,'Chi tiết');
  assert.equal(result[0].source.project,'BangNiemYetVinhBao'); assert.equal(result[0].source.datasetVersion,'2026.09.18'); assert.equal(result[0].source.sourceCommit,commit);
});
test('runtime fail closed khi canonical sai contract',()=>{
  assert.throws(()=>mergeCanonicalHandbookData({...base,version:2},[]),/contract version 3/);
  assert.throws(()=>mergeCanonicalHandbookData({...base,source_commit:''},[]),/source_commit/);
});