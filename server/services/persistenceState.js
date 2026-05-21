const envDefault = ["1", "true", "yes"].includes(
  String(process.env.SAVE_HELPER_REQUESTS || "").toLowerCase()
);

let saveHelperRequests = envDefault;

export function getPersistenceState() {
  return {
    saveHelperRequests,
    source: "runtime",
  };
}

export function setSaveHelperRequests(value) {
  saveHelperRequests = Boolean(value);
  return getPersistenceState();
}

