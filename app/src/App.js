import React, { Component } from 'react';
import './App.css';

import ContactList from './ContactList';
import ContactForm from './ContactForm';

class App extends Component {
  contactForm;

  showForm() {
    this.contactForm.open(undefined);
  }

  onFormClose() {
    this.contactList.getContact();
  }

  showDetail(e) {
    this.contactForm.open(e);
  }

  render() {
    return (
      <div className="App">
        <header className="App--header clearfix">
          <h1 className="App--title">My Awesome Contacts</h1>
          <a className="button button__large" onClick={this.showForm.bind(this)} >+ Add</a>
        </header>
        <ContactList showDetail={this.showDetail.bind(this)} ref={list => {this.contactList = list}}/>
        <ContactForm onClose={this.onFormClose.bind(this)} ref={form => {this.contactForm = form}}/>
      </div>
    );
  }
}

export default App;
