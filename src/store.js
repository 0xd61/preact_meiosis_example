import flyd from 'flyd';
//import {worker} from 'persistence-manager.js';

const serviceA = {
  initial: () => {
    return {
      description: "this is A"
    };
  },
  service: (state) => {
    return state => state;
  }
};

const serviceB = {
  initial: () => {
    return {
      name: "this is B",
      id: 0
    };
  },
  service: (state) => {
    return state => {
      console.log(state);
      state.name = "this is B " + state.id;
      return state;
    };
  }
};

const services = [serviceA, serviceB];
const service = state => services
      .map(s => s.service)
      .reduce((x, f) => f(x)(x), state);

const initialState = () => {
  const state =
        { boxes: [],
          colors:
          [ "red",
            "purple",
            "blue"
          ]
        };
  return Object.assign({},
                       state,
                       services
                       .map(service => service.initial(state))
                       .reduce((state, obj) => Object.assign(state, obj), {}));
};

const update$ = flyd.stream();
const T = (x, f) => f(x);
export const states$ = flyd.scan(T, initialState(), update$).map(service);

export const actions = ((update$) => {
  return {
    Increment: () => {
      return update$(state => {
        state.id += 1;
        return state;
      });
    },
    Decrement: () => {
      return update$(state => {
        state.id -=1;
        return state;
      });
    }
  };
})(update$);


actions.Increment();
actions.Increment();
