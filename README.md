# React SwarmUI
*A javascript/react wrapper that will connect with [SwarmUI](http://shape.stanford.edu/research/swarm/) over WebSockets*

__IN PROGRESS:__

### Documentation
To connect to a swarm, the [SwarmUI](https://github.com/ShapeLab/SwarmUI) repo needs to be downloaded. It contains the required ZooidManagerV2 software in the /Software/Applications/ folder.

#### Installation
To install this module use:
```
npm install --save react-swarm-ui
```

#### Usage
Currently there is one element type to use, "zooid". It can be used to move a Zooid to a given destination and/or switch to a given color:

```
import React from 'react';

function AZooid() {
  return (
    <zooid
      des={[<distance from right edge>, <distance from left edge>]}
      col={[<r>, <g>, <b>]}
    />
  );
}
```

*NOTE: This API will change in the near future*

To render the zooids to the swarm, use:
```
import { render } from 'react-swarm-ui';

// This can also be a WebSocket imported from 'ws'
const socket = 'http://example.com';

render(
  <AZooid />,
  socket,
  () => {
    // Called after initial render is complete
  },
)
```

To run the app, first open the ZooidManagerV2 app. Then run the application in node. The default web socket that ZooidManagerV2 listens to is http://localhost:9092.

### TODO LIST
* Add even handling, so the app can react to movement on the table
* Change ```<zooid />``` prop names, so they are "human readable"
* Add ```<area></area>``` element type, so relative positioning can be used
* Add "id" prop to ```<zooid />```, so the app can assure the same zooid is reused
