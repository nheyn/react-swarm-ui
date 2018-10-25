// @flow
import React from 'react';

import createRender from './createRender';

class TestApp extends React.Component<*, Object> {
  constructor(props) {
    super(props);

    this.state = {
      showOther: false,
      precentFromBottom: .25,
      precentFromRight: .25,
      intervalId: null,
    };
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      this.setState((state) => {
        const precentFromBottom = state.precentFromBottom + .1;
        const precentFromRight = state.precentFromRight - .1;

        return {
          showOther: !state.showOther,
          precentFromBottom: (
            precentFromBottom < 1?
              precentFromBottom:
              precentFromBottom - 1
          ),
          precentFromRight: (
            precentFromRight > 0?
              precentFromRight:
              precentFromRight + 1
          ),
        };
      });
    }, 1500);

    this.setState({ intervalId });
  }

  componentWillUnmount() {
    if (!this.state.intervalId !== 'number') return;

    clearInterval(this.state.intervalId);
    this.setState({ intervalId: null });
  }

  getDes(offset: number) {
    const { precentFromBottom, precentFromRight } = this.state;
    const { dim: [width, height], des:[bottom, right] } = this.props;
    const defaultBottom = bottom + (width * precentFromBottom);
    const defaultRight = right + (height * precentFromRight)

    return [ defaultBottom + offset, defaultRight - offset ];
  }

  render() {
    return (
      <>
        <zooid des={this.getDes(0.05)} col={[255, 0, 0]} />
        <zooid des={this.getDes(0)} col={[0, 255, 0]} />
        <zooid des={this.getDes(-0.05)} col={[0, 0, 255]} />
        {this.state.showOther?
          <zooid des={this.getDes(0.1)} col={[127, 255, 0]} />:
          null
        }
      </>
    );
  }
}

const render = createRender();
render(
  <TestApp dim={[0.5, 0.5]} des={[0, 0]} />, //TODO, need to get dim somehow
  'http://localhost:9092',
  () => console.log('intial render complete')
);
