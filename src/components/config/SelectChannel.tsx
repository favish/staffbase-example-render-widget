import { WidgetProps } from '@rjsf/utils'
import React, { ReactElement } from 'react'


import { fetchChannels } from '@/services/apiService'
import './SelectChannel.css'
import Dropdown from '@/Dropdown/Dropdown'
import DropdownOption from '@/types/DropdownOption'

interface SelectChannelDropdownState {
  channel: DropdownOption[]
  selectedChannel: string
  loadingChannel: boolean
}

/**
 * Custom widget class-based component for selecting channels.
 * @param {WidgetProps} props - The widget props passed by the parent.
 * @param {SelectChannelDropdownState} state - The widget state.
 * @returns {ReactElement} The dropdown component for channel selection.
 */
class SelectChannel extends React.Component<
  WidgetProps,
  SelectChannelDropdownState
> {
  /**
   * Constructor
   * @param {WidgetProps} props - The widget props
   */
  constructor(props: WidgetProps) {
    // Extract the channel ID from the props
    const channelID = props.value ? props.value : ''

    super(props)

    // Initialize state
    this.state = {
      channel: [],
      selectedChannel: channelID,
      loadingChannel: true,
    }
  }

  /**
   * Fetch the channel options from the API when the component mounts.
   */
  componentDidMount() {
    this.loadChannels()
  }

  /**
   * Loads the available channels and updates the state.
   */
  loadChannels = async () => {
    try {
      const channels = await fetchChannels()
      this.setState({ channel: channels, loadingChannel: false })
    } catch (error) {
      console.error('Error loading channels:', error)
    }
  }

  /**
   * Handle change of the dropdown (channel).
   * @param {React.ChangeEvent<{ name?: string | undefined; value: unknown }>} event - The change event from the dropdown.
   */
  handleChannelChange = (
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    const firstSelected = event.target.value as string

    this.setState({ selectedChannel: firstSelected })
    this.props.onChange(firstSelected)
  }

  /**
   * Render the dropdown component.
   * @returns {ReactElement} The dropdown component.
   */
  render(): ReactElement {
    const { channel, selectedChannel, loadingChannel } = this.state

    return (
      <>
        {/* Dropdown (Channel) */}
        <Dropdown
          contentType="channel"
          loading={loadingChannel}
          onChange={this.handleChannelChange}
          options={channel}
          value={selectedChannel}
        />
      </>
    )
  }
}

export default SelectChannel
