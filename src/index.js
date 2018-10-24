// @flow
import ZooidManager from './ZooidManager';

const manager = new ZooidManager('http://localhost:9092');

const unsub = manager.subscribe(async () => {
    unsub();

    try {
      await manager.setState((state) => ({
        ...state,
        zoo: state.zoo.map((zooid) => zooid.id === 0? ({
          ...zooid,
          des: [ state.dim[0] / 2, state.dim[1] / 2 ],
        }): zooid),
      }));
      console.log('sent');
    } catch(err) {
      console.error(err);
    }
});
