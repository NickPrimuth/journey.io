import React from 'react';
import { Button } from 'react-bootstrap';
import PlacesAutocomplete from 'react-places-autocomplete';

//gooogle autocomplete component
const LocationSearchInput = props => {
  const renderInput = ({
    getInputProps,
    getSuggestionItemProps,
    suggestions
  }) => (
    <div
      className="autocomplete-root d-flex flex-row"
      style={{ justifyContent: 'space-between' }}
    >
      <div style={{ display: 'inline-block' }}>
        <input
          className="form-control"
          id="cityForm"
          placeholder="Choose your city"
          {...getInputProps()}
          style={{ width: '200px' }}
        />
        <div
          className="autocomplete-dropdown-container"
          style={{ width: '200px' }}
        >
          {suggestions.map(suggestion => (
            <div {...getSuggestionItemProps(suggestion)} className="suggestion">
              <span>{suggestion.description}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ paddingLeft: '5px' }}>
        <Button
          type="primary"
          style={{ margin: '0' }}
          onClick={props.submitInterest}
        >
          I'm in!
        </Button>
      </div>
    </div>
  );

  // Limit the suggestions to show only cities in the US
  const searchOptions = {
    types: ['(cities)'],
    componentRestrictions: { country: 'us' }
  };

  return (
    <div style={{ width: '100%' }}>
      <PlacesAutocomplete
        value={props.address}
        onChange={props.handleChange}
        onSelect={props.handleSelect}
        searchOptions={searchOptions}
      >
        {renderInput}
      </PlacesAutocomplete>
    </div>
  );
};

export default LocationSearchInput;
