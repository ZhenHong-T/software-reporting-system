import { Request, Response } from 'express';
import { ContactModel, VenueModel, UserModel } from '../models';
import { Types } from 'mongoose';
import { IContact } from '../models/index';
import { getVenuesForUser } from './venue.controller';

async function getContactsForUser(userId: string): Promise<IContact[]> {
  const userVenues = await getVenuesForUser(userId);
  const contactIds = Array.from(new Set(userVenues.flatMap(venue => venue.contacts)));

  return ContactModel.find({ _id: { $in: contactIds } });
}

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    let contacts: IContact[];
    if (req.session.userRole === 'staff') {
      contacts = await getContactsForUser(req.session.userId!);
    } else {
      contacts = await ContactModel.find();
    }
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const newContact = new ContactModel(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: 'Error creating contact', error });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    let contact: IContact | null;
    if (req.session.userRole === 'staff') {
      const userContacts = await getContactsForUser(req.session.userId!);
      contact = userContacts.find(c => c._id.toString() === req.params.id) || null;
    } else {
      contact = await ContactModel.findById(req.params.id);
    }
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact', error });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: 'Error updating contact', error });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const deletedContact = await ContactModel.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await VenueModel.updateMany(
      { contacts: deletedContact._id },
      { $pull: { contacts: deletedContact._id } }
    );
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
};

export const addContactToVenue = async (req: Request, res: Response) => {
  try {
    const { contactId, venueId } = req.params;
    const contact = await ContactModel.findById(contactId);
    const venue = await VenueModel.findById(venueId);

    if (!contact || !venue) {
      return res.status(404).json({ message: 'Contact or Venue not found' });
    }

    if (!venue.contacts.includes(contact._id)) {
      venue.contacts.push(contact._id);
      await venue.save();
    }

    res.json({ message: 'Contact added to venue successfully', venue });
  } catch (error) {
    res.status(400).json({ message: 'Error adding contact to venue', error });
  }
};

export const removeContactFromVenue = async (req: Request, res: Response) => {
  try {
    const { contactId, venueId } = req.params;
    const venue = await VenueModel.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    venue.contacts = venue.contacts.filter(id => !id.equals(contactId));
    await venue.save();

    res.json({ message: 'Contact removed from venue successfully', venue });
  } catch (error) {
    res.status(400).json({ message: 'Error removing contact from venue', error });
  }
};