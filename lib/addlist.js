import fs from 'fs';

const nama_path_addlist = './src/list.json';

// Inisialisasi _db dengan data dari file list.json, jika ada

let _db = [];

try {

  const data = fs.readFileSync(nama_path_addlist, 'utf-8');

  _db = JSON.parse(data);

} catch (error) {

  console.error('Error reading or parsing list.json:', error);

  _db = []; // Inisialisasi dengan array kosong jika file tidak ada atau rusak

}

export function addResponList(groupID, key, response, isImage, image_url, _db) {

  const obj_add = {

    id: groupID,

    key: key,

    response: response,

    isImage: isImage,

    image_url: image_url

  };

  _db.push(obj_add);

  fs.writeFileSync(nama_path_addlist, JSON.stringify(_db, null, 3));

}

export function getDataResponList(groupID, key, _db) {

  if (!_db || !Array.isArray(_db)) {

    console.error('Invalid _db (not an array or null)');

    return null;

  }

  let position = null;

  _db.forEach((item, index) => {

    if (item.id === groupID && item.key === key) {

      position = index;

    }

  });

  if (position !== null) {

    return _db[position];

  }

  return null;

}

export function isAlreadyResponList(groupID, key, _db) {

  if (!_db || !Array.isArray(_db)) {

    console.error('Invalid _db (not an array or null)');

    return false;

  }

  let found = false;

  _db.forEach((item) => {

    if (item.id === groupID && item.key === key) {

      found = true;

    }

  });

  return found;

}

export function sendResponList(groupId, key, _dir) {

  if (!_dir || !Array.isArray(_dir)) {

    console.error('Invalid _dir (not an array or null)');

    return null;

  }

  let position = null;

  _dir.forEach((item, index) => {

    if (item.id === groupId && item.key === key) {

      position = index;

    }

  });

  if (position !== null) {

    return _dir[position].response;

  }

  return null;

}

export function isAlreadyResponListGroup(groupID, _db) {

  if (!_db || !Array.isArray(_db)) {

    console.error('Invalid _db (not an array or null)');

    return false;

  }

  let found = false;

  _db.forEach((item) => {

    if (item.id === groupID) {

      found = true;

    }

  });

  return found;

}

export function delResponList(groupID, key, _db) {

  if (!_db || !Array.isArray(_db)) {

    console.error('Invalid _db (not an array or null)');

    return;

  }

  let position = null;

  _db.forEach((item, index) => {

    if (item.id === groupID && item.key === key) {

      position = index;

    }

  });

  if (position !== null) {

    _db.splice(position, 1);

    fs.writeFileSync(nama_path_addlist, JSON.stringify(_db, null, 3));

  }

}

export function updateResponList(groupID, key, response, isImage, image_url, _db) {

  if (!_db || !Array.isArray(_db)) {

    console.error('Invalid _db (not an array or null)');

    return;

  }

  let position = null;

  _db.forEach((item, index) => {

    if (item.id === groupID && item.key === key) {

      position = index;

    }

  });

  if (position !== null) {

    _db[position].response = response;

    _db[position].isImage = isImage;

    _db[position].image_url = image_url;

    fs.writeFileSync(nama_path_addlist, JSON.stringify(_db, null, 3));

  }

}