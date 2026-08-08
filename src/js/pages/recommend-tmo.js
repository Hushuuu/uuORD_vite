import { TMO_CONFIG } from './../shared/tmo-config.js';
import appShared from './../shared/app-shared.js';
import { setTomItemCount } from './recommend-storage.js';

const { TMO_TRANSFER_DATA } = appShared;

// 檢查瀏覽器是否授予指定的區域網路權限。
async function checkSitePermission(permissionName) {
  try {
    const result = await navigator.permissions.query({ name: permissionName });
    return result.state === 'granted';
  } catch (error) {
    console.error(`Error checking permission for ${permissionName}:`, error);
    return false;
  }
}

// 建立輪詢控制器，將 TMO 持有資料同步到推薦功能。
function createTmoPoller({
  indices,
  ownedCountState,
  ownedSelector,
  scheduleRecommendationsRender,
  tmoConnectStatus,
  tmoToggle,
  t,
}) {
  let tmoTimerId = null;
  let activeFetchController = null;
  let tmoFailedCount = 0;

  // 取得一次 TMO 資料；啟用時安排下一次輪詢。
  async function pollTmoData() {
    if (tmoTimerId) {
      clearTimeout(tmoTimerId);
      tmoTimerId = null;
    }
    if (!tmoToggle || !tmoToggle.checked) {
      if (tmoConnectStatus) tmoConnectStatus.textContent = '';
      return;
    }

    const tmoProxyIpInput = document.getElementById('tmoProxyIpInput');
    activeFetchController = new AbortController();
    const timeoutId = setTimeout(() => activeFetchController?.abort(), TMO_CONFIG.requestTimeout);
    try {
      let tmoEndpoint = __TMO_API_ENDPOINT__;
      let targetAddressSpace = 'loopback';
      if (tmoProxyIpInput?.value) {
        tmoEndpoint = `https://${tmoProxyIpInput.value}:25626/datas`;
        targetAddressSpace = 'local';
      }

      const response = await fetch(tmoEndpoint, {
        method: 'GET',
        targetAddressSpace,
        signal: activeFetchController.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        if (tmoConnectStatus) tmoConnectStatus.textContent = t('tmo.connect_success');
        const data = await response.json();
        const units = data.units || {};
        if(Object.keys(units).length === 0) {
          return;
        }
        let effectCount = 0;
        let ownedCountsChanged = false;

        for (const [tmoId, characterId] of TMO_TRANSFER_DATA.entries()) {
          const characterRecord = indices.byCharacterId.get(characterId);
          if (!characterRecord) continue;
          const tmoCount = units[tmoId] || 0;
          if (characterRecord.level === 1 || characterRecord.level === 2) {
            const current = ownedCountState[characterRecord.level].get(characterId) || 0;
            if (current === tmoCount) continue;
            effectCount += 1;
            ownedCountsChanged = true;
            if (tmoCount === 0) ownedCountState[characterRecord.level].delete(characterId);
            else ownedCountState[characterRecord.level].set(characterId, tmoCount);
          } else if (ownedSelector) {
            effectCount += setTomItemCount(ownedSelector, characterId, tmoCount);
          }
        }

        if (effectCount > 0) {
          scheduleRecommendationsRender({ renderOwnedControls: ownedCountsChanged });
        }
      } else {
        if (tmoConnectStatus) tmoConnectStatus.textContent = t('tmo.connect_failed');
        tmoFailedCount += 1;
      }
    } catch (error) {
      console.error(error);
      if (tmoConnectStatus) tmoConnectStatus.textContent = t('tmo.connect_failed');
      tmoFailedCount += 1;
    } finally {
      activeFetchController = null;
      if (tmoFailedCount >= TMO_CONFIG.maxFailures) {
        tmoFailedCount = 0;
        tmoToggle.checked = false;
        if (tmoConnectStatus) tmoConnectStatus.textContent = t('tmo.stop_by_failed_5_times');
      }
      if (tmoFailedCount > 0) {
        const permissionName = tmoProxyIpInput?.value ? 'local-network' : 'loopback-network';
        const hasPermission = await checkSitePermission(permissionName);
        if (!hasPermission && tmoConnectStatus) {
          tmoConnectStatus.textContent += `(${t('tmo.please_grant_permission')})`;
        }
      }
      if (tmoToggle.checked) {
        tmoTimerId = setTimeout(pollTmoData, TMO_CONFIG.pollInterval);
      }
    }
  }

  // 綁定開關，停用輪詢時清除計時器與請求。
  function bind() {
    if (!tmoToggle) return;
    tmoToggle.addEventListener('change', function onTmoToggleChange() {
      tmoFailedCount = 0;
      if (this.checked) {
        if (tmoTimerId) clearTimeout(tmoTimerId);
        tmoTimerId = setTimeout(pollTmoData, TMO_CONFIG.initialPollDelay);
      } else {
        if (tmoTimerId) {
          clearTimeout(tmoTimerId);
          tmoTimerId = null;
        }
        if (activeFetchController) {
          activeFetchController.abort();
          activeFetchController = null;
        }
        if (tmoConnectStatus) tmoConnectStatus.textContent = '';
      }
    });
  }

  return { bind, pollTmoData };
}

export { createTmoPoller };
