import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactForm from "./components/ContactForm/ContactForm";
import ContactList from "./components/ContactList/ContactList";
import SearchBox from "./components/SearchBox/SearchBox";
import EditContactModal from "./components/EditContactModal/EditContactModal";
import {
  fetchContacts,
  addContact,
  deleteContact,
  updateContact,
} from "./redux/contactsOps";
import {
  selectFilteredContacts,
  selectSelectedContact,
  selectIsModalOpen,
  openModal,
  closeModal,
  setSelectedContact,
} from "./redux/contactsSlice";
import { changeFilter } from "./redux/filtersSlice";
import styles from "./App.module.css";

export default function App() {
  const dispatch = useDispatch();
  const contacts = useSelector(selectFilteredContacts);
  const selectedContact = useSelector(selectSelectedContact);
  const isModalOpen = useSelector(selectIsModalOpen);
  const [deletedContact, setDeletedContact] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleAddContact = (newContact) => {
    dispatch(addContact(newContact));
  };

  const handleDeleteContact = (id) => {
    const contactToDelete = contacts.find((contact) => contact.id === id);
    setDeletedContact(contactToDelete);
    dispatch(deleteContact(id));

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIsTimerActive(true);

    timerRef.current = setTimeout(() => {
      setIsTimerActive(false);
      setDeletedContact(null);
    }, 5000);
  };

  const handleUndoDelete = () => {
    if (deletedContact) {
      dispatch(addContact(deletedContact));
      setIsTimerActive(false);
      setDeletedContact(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  const handleEditContact = (contact) => {
    dispatch(setSelectedContact(contact));
    dispatch(openModal());
  };

  const handleSaveContact = (updatedContact) => {
    dispatch(updateContact(updatedContact));
    dispatch(closeModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleFilterChange = (e) => {
    dispatch(changeFilter(e.target.value));
  };

  return (
    <div className={styles.container}>
      <h1>Phonebook</h1>
      <ContactForm onAddContact={handleAddContact} />
      <SearchBox onChange={handleFilterChange} />
      <ContactList
        onDeleteContact={handleDeleteContact}
        onEditContact={handleEditContact}
      />
      {isTimerActive && (
        <div className={styles.undoContainer}>
          <button className={styles.undoButton} onClick={handleUndoDelete}>
            Cancel
            <div className={styles.undoButtonTimer}></div>
          </button>
        </div>
      )}
      {isModalOpen && (
        <EditContactModal
          contact={selectedContact}
          onSave={handleSaveContact}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
