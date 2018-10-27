# React SwarmUI
*A javascript/react wrapper that will connect with [SwarmUI](http://shape.stanford.edu/research/swarm/) over WebSockets*

__IN PROGRESS:__

### Documentation
To connect to a swarm, the [SwarmUI](https://github.com/ShapeLab/SwarmUI) repo needs to be downloaded. It contains the required ZooidManagerV2 software in the /Software/Applications/ folder.

#### Installation
To install this module (and its peerDependencies) use:
```
npm install --save react-swarm-ui react ws
```

#### Usage
Currently there is one element type to use, "zooid". It can be used to move a Zooid to a given destination and/or switch to a given color:

```
import React from 'react';

function AZooid() {
  return (
    <zooid
      destination={{
        right: <distance from right edge>,
        bottom: <distance from left edge>
      }}
      color={[<r>, <g>, <b>]}
      onChangePosition=((zooidData) => {
        // Called anytime the zooids position does not match its destination
      })
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

To run the app, first open the ZooidManagerV2 app, and select 'ENABLE WEB' in
the controls. The default web socket is http://localhost:9092, but can be
by the same controls. Then run your react-swarm-ui application in node.

### TODO LIST
* Add additional event handlers (like onStartMove/onEndMove)
* Send an 'Event' instead of the zooid to the even handlers
* Add ```<area></area>``` element type, so relative positioning can be used
* Add "id" prop to ```<zooid />```, so the app can assure the same zooid is reused
