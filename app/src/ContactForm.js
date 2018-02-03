import React, { Component } from 'react';
import * as moment from 'moment-timezone';
import { ContactsService, Contact } from './services/ContactsService'; 

import './ContactForm.css';

class ContactForm extends Component {
    timezones = [];
    isHidden = true;
    contact;

    constructor(props) {
        super(props);

        for (const tz in moment.tz._names) {
            if (moment.tz._names.hasOwnProperty(tz)) {
                this.timezones.push(moment.tz._names[tz]);
            }
        }

        this.state = {
            isHidden: this.isHidden,
            contact: {},
            imageValue: ''
        };

    }

    randomColor() {
        // copy paste from https://www.paulirish.com/2009/random-hex-color-code-snippets/
        return Math.floor(Math.random() * 16777215).toString(16);
    }

    open(id) {
        this.contact = {};
        
        if (id) {
            const service = new ContactsService();

            service.getOne(id).then(resp => {
                this.contact = resp;
                this.setState(Object.assign(this.contact, {}));
            });
        } else {
            this.isHidden = false;
        }
        
        this.setState(Object.assign(this.contact, {
            isHidden: this.isHidden,
            imageValue: ''
        }));
    }

    close(e) {
        e.preventDefault();

        this.isHidden = true;

        this.setState({
            isHidden: this.isHidden
        });

        this.props.onClose();
    }

    previewFile() {
        const reader = new FileReader();
        const that = this;
        
        reader.addEventListener("load", function () {
            that.setState({
                image: reader.result
            });
        }, false);

        if (this.imageFile) {
            reader.readAsDataURL(this.imageFile.files[0]);
        }
    }

    handleChange (e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    save(e) {
        e.preventDefault();

        const theContact = new Contact(
            this.state.id || undefined,
            this.state.color ? this.state.color : this.randomColor(),
            this.state.firstName,
            this.state.lastName,
            this.state.image,
            this.state.location,
            this.state.team,
            this.state.title   
        );

        const service = new ContactsService();

        service.save(theContact).then( resp => {
            alert('Contact saved with success.');

            this.close(e);
        }, e => {
            alert('Something went wrong. \n' + e);
        });
    }

    render() {
        return (
            <div className={'contact-form--wrapper ' + (this.state.isHidden ? '' :'contact-form--wrapper__open')}>
                <div className="contact-form--header clearfix">
                    <a href="" onClick={this.close.bind(this)} className="contact-form--close">&times;</a>
                </div>
                <form method="POST" onSubmit={this.save.bind(this)}>
                    <div className="field">
                        <label className="label">Portrait</label>
                        <div className="control">
                            <img style={{ display: this.state.image ? 'block' : 'none'}} src={this.state.image} height="120" alt="Preview..." /> <br />                     
                            <input type="file" ref={input => { this.imageFile = input; }} onChange={this.previewFile.bind(this)} accept=".jpg, .jpeg, .png" required/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">First Name</label>
                        <div className="control">
                            <input className="input" type="text" name="firstName" placeholder="Bruno" onChange={this.handleChange.bind(this)} value={this.state.firstName || undefined} required/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Last Name</label>
                        <div className="control">
                            <input className="input" type="text" name="lastName" placeholder="Germano" onChange={this.handleChange.bind(this)} value={this.state.lastName || undefined} required/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Title Role</label>
                        <div className="control">
                            <input className="input" type="text" name="title" placeholder="Awesome & Cool" onChange={this.handleChange.bind(this)} value={this.state.title || undefined} required />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Team</label>
                        <div className="control">
                            <input className="input" type="text" name="team" placeholder="Engineering" onChange={this.handleChange.bind(this)} value={this.state.team || undefined} required />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Location</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select name="location" onChange={this.handleChange.bind(this)} value={this.state.location || undefined} required>
                                    <option value="">Select Timezone</option>

                                    {this.timezones.map( tz => {

                                        return (<option key={tz} value={tz}>{tz}</option>);
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="field is-grouped">
                        <p className="control">
                            <button href="" className="button button__submit">Submit</button>
                        </p>
                        <p className="control">
                            <a href="" className="button" onClick={this.close.bind(this)}>Cancel</a>
                        </p>
                    </div>
                </form>
            </div>
        );
    }
}

export default ContactForm;
