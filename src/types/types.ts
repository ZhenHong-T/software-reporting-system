export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'staff' | 'manager' | 'admin';
  venues: string[];
}

export interface Venue {
  _id: string;
  name: string;
  address: string;
  contacts: string[];
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Offender {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface Incident {
  _id: string;
  date: string;
  description: string;
  venue: string;
  submittedBy: string;
}

export interface Warning {
  _id: string;
  date: string;
  offender: string;
  incidents: string[];
  submittedBy: string;
}

export interface Ban {
  _id: string;
  date: string;
  offender: string;
  warnings: string[];
  submittedBy: string;
}