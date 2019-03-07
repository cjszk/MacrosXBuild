export const TOGGLE_TAB = "TOGGLE_TAB";
export const toggleTab = tab => ({
  type: TOGGLE_TAB,
  tab
});

export const TOGGLE_MODE = "TOGGLE_MODE";
export const toggleMode = mode => ({
  type: TOGGLE_MODE,
  mode
});

export const ADD_ITEM = "ADD_ITEM";
export const addItem = item => ({
  type: ADD_ITEM,
  item
});

export const ADD_FAT_SECRET_ITEM = "ADD_FAT_SECRET_ITEM";
export const addFatSecretItem = item => ({
  type: ADD_FAT_SECRET_ITEM,
  item
});

export const ADD_USDA_ITEM = "ADD_USDA_ITEM";
export const addUsdaItem = item => ({
  type: ADD_USDA_ITEM,
  item
});

export const EDIT_TRACKED_ITEM = "EDIT_TRACKED_ITEM";
export const editTrackedItem = item => ({
  type: EDIT_TRACKED_ITEM,
  item
});

export const EDIT_LIBRARY_ITEM = "EDIT_LIBRARY_ITEM";
export const editLibraryItem = item => ({
  type: EDIT_LIBRARY_ITEM,
  item
});

export const SELECT_DATE = "SELECT_DATE";
export const selectDate = date => ({
  type: SELECT_DATE,
  date
});

export const DECREMENT_DATE = "DECREMENT_DATE";
export const decrementDate = () => ({
  type: DECREMENT_DATE
});

export const INCREMENT_DATE = "INCREMENT_DATE";
export const incrementDate = () => ({
  type: INCREMENT_DATE
});

export const SET_NEW_DAY = "SET_NEW_DAY";
export const setNewDay = () => ({
  type: SET_NEW_DAY
});

export const CHANGE_TRACKING_SETTINGS = "CHANGE_TRACKING_SETTINGS";
export const changeTrackingSettings = (key, value) => ({
  type: CHANGE_TRACKING_SETTINGS,
  key,
  value
});
