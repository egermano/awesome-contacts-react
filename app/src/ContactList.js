import React, { Component } from 'react';
import { ContactsService } from './services/ContactsService'; 

import './ContactList.css';
import ContactListFilter from './ContactListFilter';
import Contact from './Contact';

class ContactList extends Component {
  constructor(props) {
    super(props);

    this.contacts = [];

    this.state = {
      contacts: [],
      contactsList: []
    };
  }

  getContact() {
    const service = new ContactsService();
    service.all().then( resp => {
      this.contacts = resp;

      return this.contacts;
    }).then( contacts => {
      this.setState({
        contacts: this.contacts,
        contactsList: this.contacts
      });
    });
  }

  componentWillMount() {
    this.getContact();
  }

  onFilter(filters) {
    if (filters.locations.length === 0 && filters.teams.length === 0) {
      this.setState({
        contactsList: this.contacts
      });
    } else if ((filters.locations.length === 0 && filters.teams.length > 0) ||
               (filters.locations.length > 0 && filters.teams.length === 0)) {
      let filtred = this.contacts.filter( contact => {
        return filters.teams.findIndex(t => t === contact.team) >= 0 || 
          filters.locations.findIndex(l => l === contact.location) >= 0; 
      });
  
      this.setState({
        contactsList: filtred
      });
    } else {
      let filtred = this.contacts.filter(contact => {
        return filters.teams.findIndex(t => t === contact.team) >= 0 &&
          filters.locations.findIndex(l => l === contact.location) >= 0;
      });

      this.setState({
        contactsList: filtred
      });
    }

  }

  showDetail(id) {
    this.props.showDetail(id);
  }
  
  render() {
    return (
      <div className="contacts">
        <ContactListFilter contacts={this.state.contacts} onFilter={this.onFilter.bind(this)}/>
        <div className="contacts--list">
          {this.state.contactsList.map( contact => {
            return <Contact showDetail={this.showDetail.bind(this, contact.id)} key={contact.id} contact={contact}/>;
          })}
        </div>
      </div>
    );
  }
}

export default ContactList;