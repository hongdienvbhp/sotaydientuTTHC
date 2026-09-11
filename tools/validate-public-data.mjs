import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function findLocalPaths(value, location = '$', findings = []) {
  if (typeof value === 'string') {
    if (/(?:^|[^A-Za-z0-9])[A-Za-z]:[\\/]+|\/(?:Users|home)\//i.test(value)) {
      findings.push(location);
    }
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => findLocalPaths(item, `${location}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) =>
      findLocalPaths(item, `${location}.${key}`, findings)
    );
  }
  return findings;
}

export function validatePublicData(file = 'data/procedures.json') {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(data)) throw Error('Dữ liệu công khai phải là một mảng');
  const findings = findLocalPaths(data);
  if (findings.length) {
    throw Error(`Phát hiện đường dẫn cục bộ tại: ${findings.join(', ')}`);
  }
  return data.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const count = validatePublicData(process.argv[2]);
    console.log(`Dữ liệu công khai hợp lệ: ${count} thủ tục`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
