import axios from "axios";
import { API_ROUTE } from "../../env/domain/env";
import { handleResponseError } from "../utils/handle-response-error";

const instance = axios.create({
  baseURL: API_ROUTE,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleResponseError(error));
  },
);

export { instance };
