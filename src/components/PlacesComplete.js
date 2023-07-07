import { Input } from "antd";
import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";



export default class LocationSearchInput extends React.Component {
  state = {
    address: this.props.address
  };

  handleAddressChange = (address) => {
    this.setState({ address });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      this.setState({ address: nextProps.address });
    }
  }

  render() {
    const { address } = this.state;

    return (
      <PlacesAutocomplete onChange={this.handleAddressChange} onSelect={this.props.onAddressSelect} value={address}   googleCallbackName="autocomplete">
        {({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
          <React.Fragment>
            <Input
              {...getInputProps({
                id: "address-input",
                placeholder: 'Adresse',
              })}
              value={address}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                const style = suggestion.active
                  ? { backgroundColor: 'rgba(0,0,0,0.1)', cursor: "pointer", padding: 10 }
                  : { cursor: "pointer", padding: 10 };

                const spread = {
                  ...getSuggestionItemProps(suggestion, {
                    className,
                    style
                  })
                };

                return (
                  <div {...spread} key={suggestion.id}>
                    <div>{suggestion.description}</div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        )}
      </PlacesAutocomplete>
    );
  }
}