import { states$, actions } from './store.js';
import flyd from 'flyd';

let syncWorker;

const messages$ = flyd.stream();

if (window.Worker) {
  syncWorker = new Worker('persistence-worker.js', { type: "module" });
  syncWorker.addEventListener('message', messages$);
};


messages$.map(msg => console.log(msg.data));

const test = () => {
  console.log("im executed by the worker");
  return;
};

syncWorker.postMessage({});

export const worker = syncWorker;
