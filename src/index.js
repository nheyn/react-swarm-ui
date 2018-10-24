// @flow
import ZooidManager from './ZooidManager';

const manager = new ZooidManager('http://localhost:9092');

manager.subscribe(async () => {
    try {
      await manager.setState((state) => ({
        ...state,
        zoo: state.zoo.map((zooid) => ({
          ...zooid,
          des: zooid.pos,
        })),
      }));
    } catch(err) {
      console.error(err);
    }
});
