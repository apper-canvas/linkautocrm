import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = () => {
    setEditContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditContact(contact);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditContact(null);
  };

  const handleFormSuccess = () => {
    loadContacts();
  };

  if (loading) {
    return (
      <div>
        <Header 
          title="Contacts"
          action={true}
          actionLabel="Add Contact"
          onAction={handleAddContact}
        />
        <div className="p-6">
          <Loading variant="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header 
          title="Contacts"
          action={true}
          actionLabel="Add Contact"
          onAction={handleAddContact}
        />
        <div className="p-6">
          <Error message={error} onRetry={loadContacts} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Contacts"
        action={true}
        actionLabel="Add Contact"
        onAction={handleAddContact}
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {contacts.length === 0 ? (
            <Empty
              message="No contacts yet"
              description="Add your first contact to get started with managing your CRM"
              actionLabel="Add Contact"
              onAction={handleAddContact}
              icon="Users"
            />
          ) : (
            <ContactTable
              contacts={contacts}
              onEdit={handleEditContact}
              onRefresh={loadContacts}
            />
          )}
        </div>
      </div>

      <ContactForm
        isOpen={showForm}
        onClose={handleFormClose}
        contact={editContact}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default Contacts;