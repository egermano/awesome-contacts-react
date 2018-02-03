import { Request } from '../helpers/Request';

const BASE_URL = 'http://localhost:5000';

function guid() {
  // copy and paste from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4();
}

/**
 * DAO of Contact
 */
class Contact {
  id;
  color;
  firstName;
  lastName;
  image;
  location; //Location as timezone https://en.wikipedia.org/wiki/Tz_database
  team;
  title;

  constructor(id, color, firstName, lastName, image, location, team, title) {
    this.id = id;
    this.color = color;
    this.firstName = firstName;
    this.lastName = lastName;
    this.image = image;
    this.location = location;
    this.team = team;
    this.title = title;
  }
  
  toRequest() {
    return {
      'id': this.id, 
      'color': this.color, 
      'first_name': this.firstName, 
      'last_name': this.lastName, 
      'image': this.image, 
      'location': this.location, 
      'team': this.team, 
      'title': this.title
    }
  }
}

class ContactsService {

  /**
   * Get of filter contacts
   * @param {*} filter (Optional) object with filter data
   */
  get(filter) {
    const req = new Request(`${BASE_URL}/contacts`);
    return req.getJSON(filter).then( resp => {
      return resp.map ( contact => new Contact(contact.id, contact.color, contact.first_name, contact.last_name, contact.image, contact.location, contact.team, contact.title))
    });
  }

  /**
   * Get on contact
   * @param {string} id Contact id. 
   */
  getOne(id) {
    // TODO: check if id is valid
    const req = new Request(`${BASE_URL}/contacts/${id}`);
    return req.getJSON().then(contact => {
      return new Contact(contact.id, contact.color, contact.first_name, contact.last_name, contact.image, contact.location, contact.team, contact.title);
    });
  }

  /**
   * Short to get all contact
   */
  all() {
    return this.get(null);
  }

  /**
   * Save new Contact
   * @param {Contact} contact 
   */
  create(contact) {
    const req = new Request(`${BASE_URL}/contacts`);
    return req.post(contact.toRequest()).then(contact => {
      return new Contact(contact.id, contact.color, contact.first_name, contact.last_name, contact.image, contact.location, contact.team, contact.title);
    });
  }

  /**
   * Update contact data
   * @param {string} id 
   * @param {Contact} contact 
   */
  update(id, contact) {
    const req = new Request(`${BASE_URL}/contacts/${id}`);
    return req.put(contact.toRequest()).then(contact => {
      return new Contact(contact.id, contact.color, contact.first_name, contact.last_name, contact.image, contact.location, contact.team, contact.title);
    });
  }

  /**
   * Short to update or create Contact
   * @param {Contact} contact 
   */
  save(contact) {
    if (contact.id) {
      const id = contact.id;
      delete contact.id;
      return this.update(id, contact);
    } else {
      contact.id = guid();
      return this.create(contact);
    }
  }
}

export { Contact, ContactsService };