import {
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { GLOBALS_UPDATED } from '@storybook/core-events';
import { getActiveData } from '../app/utils';
// organize-imports-ignore
import React, { Component } from 'react';

export class ToolSelector extends Component {
  state = {
    selected: null,
    expanded: false,
    list: [],
  };

  componentDidMount() {
    this.props.api.on(this.getToolActionIdentifier(), this.setData);
    this.props.api.on(GLOBALS_UPDATED, this.reload);
  }

  componentWillUnmount() {
    this.props.api.off(this.getToolActionIdentifier(), this.setData);
    this.props.api.off(GLOBALS_UPDATED, this.reload);
  }

  reload = () => {
    if (getActiveData(this.getToolIdentifier()) !== this.state.selected) {
      location.reload();
    }
  };

  setData = (data) => {
    this.setState({
      selected: getActiveData(this.getToolIdentifier()) ?? data.default,
      list: Object.keys(data.list),
    });
  };

  click(value) {
    if (value === this.state.selected) {
      return;
    }

    this.props.api.updateGlobals({
      [this.getToolIdentifier()]: value,
    });

    this.setState({
      expanded: false,
    });
  }

  getToolIdentifier() {
    return '';
  }
  getToolActionIdentifier() {
    return '';
  }

  getSelectorTitle() {
    return '';
  }

  render() {
    const { expanded } = this.state;
    const links = this.state.list.map((value) => ({
      id: value,
      title: value,
      value,
      active: this.state.selected === value,
      onClick: () => this.click(value),
    }));

    return (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={expanded}
        onVisibilityChange={(newVisibility) =>
          this.setState({ expanded: newVisibility })
        }
        tooltip={<TooltipLinkList links={links} />}
        closeOnClick
      >
        <IconButton
          key={this.getToolIdentifier()}
          title={this.getSelectorTitle()}
        >
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>
    );
  }
}
