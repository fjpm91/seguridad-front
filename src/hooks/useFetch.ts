import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import { BackendResponse } from "../interfaces/interfaces";
import { ApiEndpoints } from "../models/enums";
const useFetch = () =>
  useQuery({
    queryKey: ["empresas"],
    queryFn: () =>
      apiClient
        .get<BackendResponse>(`/${ApiEndpoints.EMPRESAS}`)
        .then((res) => res.data),
  });

export default useFetch;
