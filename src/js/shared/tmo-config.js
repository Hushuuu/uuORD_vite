// 集中管理 TMO 輪詢功能的時間與重試限制。
const TMO_CONFIG = Object.freeze({
  initialPollDelay: 500,
  pollInterval: 2200,
  requestTimeout: 5000,
  maxFailures: 5,
});

export { TMO_CONFIG };
