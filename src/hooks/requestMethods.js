import axios from "axios";
const BASEURL = "http://localhost:8800/api";



// axios
export const customAxios = axios.create({
  baseURL: BASEURL,
  headers: { "Content-Type": "application/json"},
});
