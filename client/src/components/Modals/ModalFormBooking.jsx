import React, { useEffect, useState } from "react";
import { getAddresses } from "../../api/addresses";
import CustomSelect from "../../ux/CustomSelect";

export default function ModalFormBooking({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    getAddresses().then(setBranches);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      name,
      surname,
      phone,
      branch,
    };

    fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    onSubmit();
    onClose();
  };

  if (!isOpen) return null;

  const branchOptions = branches.map((b) => ({
    label: `${b.street}, ${b.house} (${b.school})`,
    value: `${b.street}, ${b.house} (${b.school})`,
  }));

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal__content modal__content-edit"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose}>
          <img src="/icon/Close.svg" alt="Закрыть" />
        </button>
        <h2 className="modal__title">Запись на тренировку</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal__input booking__modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Имя*"
          />
          <input
            type="text"
            className="modal__input booking__modal-input"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            placeholder="Фамилия*"
          />
          <input
            type="tel"
            className="modal__input booking__modal-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Номер телефона*"
          />

          <div className="modal__label">
            <CustomSelect
              options={branchOptions}
              selected={branch}
              onChange={(option) => setBranch(option.value)}
              placeholder="Филиал*"
              className="custom-select--modal"
            />
          </div>

          <button type="submit" className="modal__save">
            Записаться
          </button>
        </form>
      </div>
    </div>
  );
}
