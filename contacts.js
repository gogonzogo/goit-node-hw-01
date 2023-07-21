const fs = require('fs').promises;
const path = require('node:path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

const readContacts = fs.readFile(contactsPath).then(data => JSON.parse(data)).catch(error => console.log(error));

async function listContacts() {
  try {
    const contactsData = await readContacts;
    console.table(contactsData);
    return contactsData;
  } catch (error) {
    return console.log(error);
  }
};

async function getContactById(contactId, remove) {
  try {
    let contactExists = true;
    const contactsData = await readContacts;
    for (let i = 0; i < contactsData.length; i += 1) {
      if (contactsData[i].id === contactId) {
        const contact = contactsData[i];
        if (remove) {
          return contact;
        } else {
          console.table(contact)
          return contact;
        }
      } else {
        contactExists = false;
      }
    }
    if (!contactExists) {
      console.log(`${contactId} does not exist`)
    }
  } catch (error) {
    console.log(error)
  }
};

async function addContact(name, email, phone) {
  try {
    const contactsData = await readContacts;
    if (name, email, phone) {
      const newContact = {
        id: nanoid(),
        name: name,
        email: email,
        phone: phone,
      }
      contactsData.push(newContact);
      fs.writeFile(contactsPath, JSON.stringify(contactsData))
      console.table(contactsData)
    } else {
      console.log(`Missing arg`)
    }
  }
  catch (error) {
    console.log(error)
  };
};

async function removeContact(contactId) {
  let remove = true;
  try {
    const contact = await getContactById(contactId, remove);
    const contactsData = await readContacts;
    if (contact) {
      for (let i = 0; i < contactsData.length; i += 1) {
        if (contactsData[i].id === contact.id) {
          const index = [i];
          contactsData.splice(index, 1);
        }
      }
      await fs.writeFile(contactsPath, JSON.stringify(contactsData));
      console.table(contactsData);
    }

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};
