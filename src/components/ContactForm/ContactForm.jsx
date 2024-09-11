import { useState } from "react";
import styles from "./ContactForm.module.css";

const ContactForm = ({ onAddContact }) => {
  const [name, setName] = useState("");
  const [number, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && number) {
      if (typeof onAddContact === "function") {
        onAddContact({ name, number });
        setName("");
        setPhone("");
      } else {
        console.error("onAddContact is not a function");
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Name
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Phone
        <input
          className={styles.input}
          type="text"
          value={number}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <button className={styles.button} type="submit">
        Add Contact
      </button>
    </form>
  );
};

export default ContactForm;
