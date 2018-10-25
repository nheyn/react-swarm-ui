// @flow
/*import ZooidManager from './ZooidManager';

const manager = new ZooidManager('http://localhost:9092');

manager.subscribe(async () => {
    try {
      /*
      await manager.setZooids((zooids) => zooids.map((zooid) => ({
        ...zooid,
        des: zooid.pos,
      })));//*/
      /*
      await manager.setZooids((zooids) => zooids.map((zooid) => ({
        ...zooid,
        des: zooid.id === 0? [0, 0]: zooid.pos,
        col: zooid.id === 0? [125, 0, 0]: zooid.col,
      })));//* /
    } catch(err) {
      console.error(err);
    }
});*/
import ZooidElement from './ZooidElement';
import ZooidManager from './ZooidManager';

const manager = new ZooidManager('http://localhost:9092');
const element = new ZooidElement(manager, {
  id: 0,
  des: [1, 0],
  col: [0, 0, 1],
});

element.update().then(console.log, console.error);
