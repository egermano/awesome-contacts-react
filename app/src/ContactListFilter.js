import React, { Component } from 'react';

import './ContactListFilter.css';

class ContactListFilter extends Component {
  
  contacts;
  activeFilters = [];
  locations = {};

  constructor(props) {
    super(props);
    
    this.state = { 
      locations: [], 
      teams: [],
      activeFilters: []
    };
  }
  
  componentWillReceiveProps (props) {
    this.contacts = props.contacts;

    // Parse locations
    let locations = this.contacts
      .map(contact => {
        try {
          let location = contact.location.split('/')[1];
          this.locations[location] = contact.location;
          return location;
        } catch (error) {
          return undefined;
        }
      })
      .filter( location => { return location !== undefined; })
      .sort((a, b) => a.localeCompare(b));

    // create a set with unique items
    locations = Array.from(new Set(locations));

    // Parse Teams
    let teams = this.contacts
      .map( contact => contact.team)
      .filter(team => { return team !== undefined; })
      .sort((a, b) => a.localeCompare(b));

    teams = Array.from(new Set(teams));
      
    this.setState({
      'locations': locations,
      'teams': teams
    });
  }

  filter(key, e) {
    e.preventDefault();

    let index = this.activeFilters.findIndex(value => value === key);

    if (index >= 0) {
      this.activeFilters.splice(index,1);
    } else {
      this.activeFilters.push(key);
    }

    this.setState({
      activeFilters: this.activeFilters
    });

    let filters = {
      locations: [],
      teams: []
    };

    this.activeFilters.forEach( item => {
      if (item.indexOf('filter-location-') >= 0 ) {
        let location = this.locations[item.replace('filter-location-', '')];
        filters.locations.push(location);
      } else if (item.indexOf('filter-team-') >= 0) {
        filters.teams.push(item.replace('filter-team-',''));
      }
    });

    // Emit filter
    this.props.onFilter(filters);
  }

  render() { 
    return (
      <div className="contacts--filter">
        <ul className="contacts--filter-list">
          <li className="contacts--filter-title">Locations: </li>
          {this.state.locations.map(location => {
            let key = 'filter-location-' + location.toString();
            let classes = this.state.activeFilters.findIndex( value => value === key) >= 0 ? 'active' : '';
            
            return <li key={key}>
              <a className={'button ' + classes} 
                onClick={this.filter.bind(this, key)} 
                href="">
                {location.replace(/_/g, ' ')}
              </a>
            </li>
          })}
        </ul>

        <ul className="contacts--filter-list">
          <li className="contacts--filter-title">Teams: </li>
          {this.state.teams.map(team => {
            let key = 'filter-team-' + team.toString();
            let classes = this.state.activeFilters.findIndex(value => value === key) >= 0 ? 'active' : '';

            return <li key={key}>
              <a className={'button ' + classes} 
                onClick={this.filter.bind(this, key)} 
                href="">
                  {team}
              </a>
            </li>
          })}
        </ul>
      </div>
    );
  }
}

export default ContactListFilter;