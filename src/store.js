import flyd from 'flyd';

const profile = {
  initialState: {
    count: 10,
    blah: 12
  },
  actions: update$ => {
    return {
      increment: () => {
        update$(state => {
          state.profile.count += 1;
          return state;
        });
      },
      reset: () => {
        update$(state => {
          state.profile.count = 10;
          return state;
        });
      }
    };
  }
};

const app = {
  initialState: {
    profile: profile.initialState,
  },
  actions: update => {
    return {
      profile: profile.actions(update$),
    };
  }
};

const update$ = flyd.stream();

export const states$ = flyd.scan((state, patch) => patch(state), app.initialState, update$);

export const actions = app.actions(update$);
