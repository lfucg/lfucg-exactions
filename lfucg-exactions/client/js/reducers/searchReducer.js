import {
  dissoc,
  path,
} from 'ramda';

import {
  CLEAR_SEARCH,
  UPDATE_SEARCH,
} from '../constants/searchConstants';

const initialState = {
  searchParams: {},
}

const searchReducer = (state = initialState, action) => {
  const { type } = action;
  let page = '';
  if (path(['params', 'page'], action)) {
    page = action.params.page.replace(' ', '');
  }

  switch (type) {
    case UPDATE_SEARCH:
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          [page]: {
            ...state.searchParams[page],
            ...dissoc('page', action.params),
          },
        },
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        searchParams: {
          ...state.searchParams,
          [page]: {},
        },
      };
    default:
      return state;
  }
};

export default searchReducer;
