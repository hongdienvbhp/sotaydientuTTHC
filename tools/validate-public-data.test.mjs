import test from 'node:test';
import assert from 'node:assert/strict';
import {findLocalPaths} from './validate-public-data.mjs';

test('chặn đường dẫn Windows trong chuỗi lồng nhau', () => {
  const findings = findLocalPaths([{detail:{note:"Không đọc được C:\\Users\\SYNTHETIC\\file.pdf"}}]);
  assert.deepEqual(findings, ['$[0].detail.note']);
});

test('chặn đường dẫn thư mục người dùng Unix', () => {
  assert.equal(findLocalPaths({note:'/home/synthetic/file.pdf'}).length, 1);
  assert.equal(findLocalPaths({note:'/Users/synthetic/file.pdf'}).length, 1);
});

test('chấp nhận dữ liệu không chứa đường dẫn máy', () => {
  assert.deepEqual(findLocalPaths({note:'Vui lòng mở PDF nguồn để xem nội dung.'}), []);
});
