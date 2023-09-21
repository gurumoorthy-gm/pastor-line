import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useNavigate, useParams } from "react-router-dom";
import { getContatsService } from "../services/getContactsService";
import "../styles/ContactsModal.css";
import Form from "react-bootstrap/Form";
import { Spinner } from "react-bootstrap";

function ContactsModal() {
  const [filterEven, setFilterEven] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const Navigate = useNavigate();
  const { from } = useParams();
  const [countryId, setCountryId] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (from === "buttonB") {
      setData([]);
      setPage(1);
      setCountryId(226);
      setFilterEven(false);
      setSearchQuery("");
      fetchData(1, "", 226);
    } else if (from === "buttonA") {
      setData([]);
      setPage(1);
      setCountryId(null);
      setFilterEven(false);
      setSearchQuery("");
      fetchData(1, "", null);
    }
  }, [from]);

  const fetchData = (
    qpage = page,
    query = searchQuery,
    specificCountryId = countryId,
    keypress = false
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    getContatsService(qpage, query, specificCountryId)
      .then((response) => {
        const contactsArray = Object.values(response.contacts);
        setData((prevData) => {
          if (searchQuery !== query || page === 1) {
            return [...contactsArray];
          }
          return [...prevData, ...contactsArray];
        });
        setPage((prevPage) => {
          if (searchQuery !== query || keypress) {
            return 1;
          }
          return prevPage + 1;
        });
        setTotalData(response.total);
        setIsLoading(false);
        setError(null);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
        console.log(error);
      });
  };

  const handleScroll = (values) => {
    if ((page - 1) * 20 >= totalData) {
      return;
    } else if (values.top === 1) {
      fetchData();
    }
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    clearTimeout(searchTimeout);

    if (event.key === "Enter") {
      fetchData(1, query, "", true);
    } else {
      const newTimeout = setTimeout(() => {
        fetchData(1, query, "");
      }, 1000);

      setSearchTimeout(newTimeout);
    }
  };

  const handleContactClick = (contact) => {
    if (!filterEven || (filterEven && contact.id % 2 === 0)) {
      setSelectedContact(contact);
    }
  };

  const handleCheckboxChange = (event) => {
    console.log(event.target.checked, "event.target.checked");
    setFilterEven(event.target.checked);
  };

  return (
    <Modal
      className="contacts-modal"
      show={true}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{`${
          from === "buttonA" ? "All Contacts" : "US Contacts"
        }`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or number..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          onKeyPress={handleSearchInputChange}
        />
        <Scrollbars
          style={{ width: "100%", height: "400px" }}
          onScrollFrame={handleScroll}
        >
          {!isLoading && error && <div className="error">Error Occured.</div>}
          {!error && totalData === 0 && !isLoading ? (
            <div className="no-contacts">No contacts found</div>
          ) : (
            ""
          )}
          <div>
            {data.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className={`contact-item ${
                  filterEven && contact.id % 2 !== 0 ? "hidden" : ""
                }`}
              >
                {contact.id} - {contact.phone_number}
              </div>
            ))}
          </div>
          <div
            className={`infinite-scroll-loader ${
              isLoading ? "visible" : "hidden"
            }`}
          >
            <Spinner animation="border" variant="primary" className="spinner" />
          </div>
        </Scrollbars>
      </Modal.Body>
      <Modal.Footer>
        <div className="footerDiv">
          <Form>
            <div key={`default-checkbox`}>
              <Form.Check
                checked={filterEven}
                type={"checkbox"}
                id={`default-checkbox`}
                label={`Only even`}
                onChange={handleCheckboxChange}
              />
            </div>
          </Form>
          <button
            className="btn-btnA"
            disabled={from === "buttonA"}
            onClick={() => Navigate("/modal/buttonA")}
          >
            All Contacts
          </button>
          <button
            className="btn-btnB"
            disabled={from === "buttonB"}
            onClick={() => Navigate("/modal/buttonB")}
          >
            US Contacts
          </button>
          <button className="button-close" onClick={() => Navigate("/")}>
            Close
          </button>
        </div>
      </Modal.Footer>

      {selectedContact && (
        <Modal
          className="modal-container"
          show={true}
          backdrop="static"
          onHide={() => setSelectedContact(null)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Contact Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>First Name: {selectedContact.first_name}</p>
            <p>Last Name: {selectedContact.last_name}</p>
            <p>Email: {selectedContact.email || "N/A"}</p>
          </Modal.Body>
        </Modal>
      )}
    </Modal>
  );
}

export default ContactsModal;
