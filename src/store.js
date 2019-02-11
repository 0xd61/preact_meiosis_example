import flyd from 'flyd';

const profile1 = {
  initialState: {
    count: 10,
    blah: 12
  },
  actions: update$ => {
    return {
      increment: () => {
        update$(state => {
          setTimeout( () => state.profile1.count += 1, 3000);
          return state;
        });
      },
    };
  }
};

const profile2 = {
  initialState: {
    count: 10,
  },
  actions: update$ => {
    return {
      increment: () => {
        update$(state => {
          state.profile2.count += 1;
          return state;
        });
      },
    };
  }
};

const app = {
  initialState: {
    profile1: profile1.initialState,
    profile2: profile2.initialState
  },
  actions: update => {
    return {
      profile1: profile1.actions(update$),
      profile2: profile2.actions(update$)
    };
  }
};

const update$ = flyd.stream();

export const states$ = flyd.scan((state, patch) => patch(state), app.initialState, update$);

export const actions = app.actions(update$);
