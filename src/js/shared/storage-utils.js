// 從儲存空間讀取 JSON 陣列，安全處理缺少或無效的資料。
function readStoredArray(storage, key) {
  try {
    const parsed = JSON.parse(storage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 將陣列轉成 JSON，儲存到指定的 key。
function writeStoredArray(storage, key, values) {
  storage.setItem(key, JSON.stringify(values));
}

// 切換導覽列使用的資料維護頁面顯示旗標。
function setCanMaintain(value) {
  localStorage.setItem('canMaintain', value ? 'true' : 'false');
}

// 檢查資料維護頁面是否應該顯示。
function getIfCanMaintain() {
  return localStorage.getItem('canMaintain') === 'true';
}

// 對具備權限的使用者顯示資料維護導覽連結。
function showMaintenanceNav() {
  if (!getIfCanMaintain()) {
    return;
  }

  const navLink = document.querySelector('.nav-link[data-page="maintenance"]');
  if (navLink) {
    navLink.style.display = 'block';
  }
}

export {
  readStoredArray,
  writeStoredArray,
  setCanMaintain,
  getIfCanMaintain,
  showMaintenanceNav,
};
