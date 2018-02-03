import React, { Component } from 'react';
import * as moment from 'moment-timezone';

import dummyAvatar from './avatar.png';
import './Contact.css';

class Contact extends Component {
  me;

  constructor(props) {
    super(props);
    this.me = props.contact;
  }

  hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  showDetail(e) {
    e.preventDefault();
    
    this.props.showDetail(this.me.id);
  }

  render() {
    let rgbColor = this.hexToRgb(this.me.color);
    let contactStyle = {
      'backgroundColor': `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, .12) `
    };

    this.me.locationDiff = '';

    if (this.me.location) {
      
      let now = moment();
      let localOffset = now.utcOffset();
      let userOffset = now.tz(this.me.location).utcOffset();
      let diff = (userOffset - localOffset) / 60;

      this.me.locationDiff = (diff > 0? '+': '') + diff + 'h';

      let [first, second] = this.me.location.split('/')[1];

      this.me.locationLabel = (second ? second : first).replace(/_/g, ' ');
    }

    return (<div className="contact">
      <div className="contact--container" style={contactStyle}>
        <object className="contact--avatar" data={this.me.image || dummyAvatar} type="image/png" alt={this.me.firstName} title={this.me.firstName + ' ' + this.me.lastName}>
          <img className="contact--avatar" src={dummyAvatar} alt={this.me.firstName} title={this.me.firstName + ' ' + this.me.lastName}/>
        </object>
        <div className="contact--meta">
          <h3 className="contact--name">{this.me.firstName} {this.me.lastName}</h3>
          {this.me.title ? <p className="contact--title"><span role="img" aria-label="Title">💼</span> {this.me.title}</p> : ''}
          {this.me.team ? <p className="contact--team"><span role="img" aria-label="Team">🤜</span> {this.me.team}</p> : ''}
          {this.me.location ? <p className="contact--location"><span role="img" aria-label="Location">📍</span> {this.me.locationLabel} {this.me.locationDiff}</p> : ''}
        </div>
        <div className="contact--actions">
          <p><a className="button button__block" onClick={this.showDetail.bind(this)} href=""><span role="img" aria-label="Edit">✏️</span> Edit</a></p>
        </div>
      </div>
    </div>);
  }
}

export default Contact;