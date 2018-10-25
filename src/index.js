// @flow
import ZooidManager from './ZooidManager';

const manager = new ZooidManager('http://localhost:9092');

manager.subscribe(async () => {
    try {
      /*
      await manager.setZooids((zooids) => zooids.map((zooid) => ({
        ...zooid,
        des: zooid.pos,
      })));//*/
      //*
      await manager.setZooids((zooids) => zooids.map((zooid) => ({
        ...zooid,
        des: zooid.id === 0? [0, 0]: zooid.pos,
        col: zooid.id === 0? [125, 0, 0]: zooid.col,
      })));//*/
    } catch(err) {
      console.error(err);
    }
});
