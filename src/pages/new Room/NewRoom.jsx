import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = ({ inputs, title }) => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);
  const { data, loading } = useFetch("/hotels");
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    //Here we need to convert the rooms to an array of Object  to give us room Numbers
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    //console.log(roomNumbers)
    try {
      await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  onChange={(event) => setRooms(event.target.value)}
                  placeholder="give comma between room numbers"
                />
              </div>
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(event) => setHotelId(event.target.value)}
                >
                  {loading
                    ? "Loading..."
                    : data &&
                      data.map((hotel) => (
                        <option value={hotel._id} key={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
