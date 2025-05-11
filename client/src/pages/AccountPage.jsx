import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useConfirmDelete } from "../hooks/useConfirmDelete";

function AccountPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { openConfirm, Confirm } = useConfirmDelete();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/account", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUserData(data);

      console.log({response})
      if(response.status > 399) {
        navigate('/login')
      }

      // const mockData = {
      //   parent: {
      //     name: "Иван",
      //     surname: "Иванов",
      //     phone: "+375291112233",
      //   },
      //   child: {
      //     name: "София",
      //     surname: "Иванова",
      //     birthDate: "2015-05-10",
      //     team: null,
      //     schedule: null,
      //     address: null,
      //   },
      // };

      console.log({data})
      setUserData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return null;
  if (!userData) return null;

  const { parent } = userData;
  const child = userData.children[0] // needs to be changed

  console.log({child})

  const handleEditParent = () => {
    navigate("/account/edit-parent", {
      state: {
        name: parent.name,
        surname: parent.surname,
        phone: parent.phone,
      },
    });
  };

  return (
    <div className="account">
      <h1 className="registration__title">ЛИЧНЫЙ КАБИНЕТ</h1>

      <div className="account-card">
        <div className="account-card__section account-card__section-parent">
          <div className="account-card__info">
            <div className="card__field">
              <span className="card__label">Пользователь:</span>
              <span className="card__value">{parent.name} {parent.surname}</span>
            </div>
            <div className="card__field">
              <span className="card__label">Номер телефона: </span>
              <span className="card__value">{parent.phone}</span>
            </div>
          </div>

          <div className="card__actions">
            <button className="card__icon-button" onClick={handleEditParent}>
              <img src="/icon/edit.svg" alt="Редактировать" />
            </button>
          </div>
        </div>

        <div className="account-card__divider" />

        {child && (
          <div className="account-card__section-child">
            <div className="account-card__info">
              <div className="card__field">
                <span className="card__value">{child.name} {child.surname}</span>
              </div>
              <div className="card__field">
                <span className="card__label">Дата рождения: </span>
                <span className="card__value">{child.birthDate}</span>
              </div>
              <div className="card__field">
                <span className="card__label">Команда: </span>
                <span className="card__value">{child.team || "–"}</span>
              </div>
              <div className="card__field">
                <span className="card__label">Расписание: </span>
                <span className="card__value">{child.schedule || "–"}</span>
              </div>
              <div className="card__field">
                <span className="card__label">Адрес: </span>
                <span className="card__value">{child.address || "–"}</span>
              </div>
            </div>
            <div className="card__actions-account">
              <button className="card__icon-button" onClick={() =>
                  navigate("/register/child", {
                    state: {
                      id: child.id,
                      name: child.name,
                      surname: child.surname,
                      birthDate: child.birthDate,
                    },
                  })
                }>
                <img src="/icon/edit.svg" alt="Редактировать" />
              </button>
              <button
                className="card__delete"
                onClick={() =>
                  openConfirm("delete-child", () =>
                    setUserData((prev) => ({
                      ...prev,
                      child: null,
                    }))
                  )
                }
              >
                <img src="/icon/delete.svg" alt="Удалить" className="card__delete-icon" />
              </button>


            </div>
          </div>
        )}

        <button
          className="card__add account__add"
          onClick={() => navigate("/register/child")}
        >
          + Добавить ребенка
        </button>
      </div>

      <button
        className="registration__submit-button account__submit-button"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/");
        }}
      >
        Выйти из аккаунта
      </button>

      <Confirm />

    </div>
  );
}

export default AccountPage;
