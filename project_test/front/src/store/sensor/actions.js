export const FETCH_FORM_VALUES = 'FETCH_FORM_VALUES';
export const SET_FORM_VALUES = 'SET_FORM_VALUES';
export const SET_TRANSFERPROTOCOL = 'SET_TRANSFERPROTOCOL';
export const fetchFormValues = (payload) => ({
  type: FETCH_FORM_VALUES,
  payload,
});

export const setFormValues = (payload) => ({
  type: SET_FORM_VALUES,
  payload,
});

export const fetchTRANSFERPROTOCOL = (payload) => ({
  type: SET_TRANSFERPROTOCOL,
  payload,
});
