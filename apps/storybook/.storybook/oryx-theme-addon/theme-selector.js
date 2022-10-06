import {
  Icons,
  IconButton,
  WithTooltip,
  TooltipLinkList,
} from '@storybook/components';
import { GLOBALS_UPDATED } from '@storybook/core-events';
import {
  ORYX_STORYBOOK_THEME,
  getActiveTheme,
  SET_STORYBOOK_THEME,
} from '../app/utils';
// organize-imports-ignore
import React, { Component } from 'react';

export class ThemeSelector extends Component {
  state = {
    selected: null,
    expanded: false,
    list: [],
  };

  componentDidMount() {
    this.props.api.on(SET_STORYBOOK_THEME, this.setTheme);
    this.props.api.on(GLOBALS_UPDATED, this.reload);
  }

  componentWillUnmount() {
    this.props.api.off(GLOBALS_UPDATED, this.reload);
    this.props.api.off(SET_STORYBOOK_THEME, this.setTheme);
  }

  reload = () => {
    if (getActiveTheme() !== this.state.selected) {
      location.reload();
    }
  };

  setTheme = (theme) => {
    this.setState({
      selected: getActiveTheme() ?? theme.default,
      list: Object.keys(theme.list),
    });
  };

  click(value) {
    if (value === this.state.selected) {
      return;
    }

    this.props.api.updateGlobals({
      [ORYX_STORYBOOK_THEME]: value,
    });
    this.setState({
      expanded: false,
    });
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
        <IconButton key="theme" title="Change the theme of the preview">
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>
    );
  }
}
