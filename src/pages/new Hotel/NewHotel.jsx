import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewHotel = ({ inputs, title }) => {
  const [files, setFiles] = useState("");
  const [info, setInfo] = useState({});
  const { data, loading, error } = useFetch("/rooms");
  // console.log(data)
  const [rooms, setRooms] = useState([]);

  const handleChange = (event) => {
    setInfo((prev) => ({ ...prev, [event.target.id]: event.target.value }));
  };

  const handleSelect = (event) => {
    //console.log(event.target.selectedOptions); //Here, what will be printed out will be HtmlCollection
    //So we need to transform it to Array

    const selectedvalues = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setRooms(selectedvalues);
  };

  //console.log(files), Here, our files here are objects, so we have to transform it to Array

  //console.log(Object.keys(files).map(key =>(files[key]))) was converted to array here
  //console.log(Object.values(files)) was converted to array here as well

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      const listOfPhotoUploaded = await Promise.all(
        Object.values(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");
          const uploadResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/drwa2jhdf/image/upload",
            data
          );
          const { url } = uploadResponse.data;
          return url;
        })
      );
     const newHotel = {
          ...info,
          rooms,
          photos: listOfPhotoUploaded
      }
     await axios.post("/hotels", newHotel)  
    } catch (error) {}
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
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

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
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
              <div className="selectedRooms">
                <label>Rooms</label>
                <select id="rooms" onChange={handleSelect} multiple>
                  {loading
                    ? "Loading..."
                    : data &&
                      data.map((room) => (
                        <option value={room._id} key={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Send</button>
              {error && <span>{error.message}</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
