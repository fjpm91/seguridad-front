import { useEffect, useState } from "react";
import { AxiosRequestConfig, CanceledError } from "axios";
import apiClient from "../services/api-client";

const useData = <T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps?: any[]
) => {
  const [responseData, setData] = useState<T>({} as T);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState("");

useEffect(() => {
  const controller =  new AbortController();
  setIsLoading(true)
  apiClient
    .get<T>(endpoint, {
        signal: controller.signal,
        ...requestConfig
    })
    .then((res) => {
        setData(res.data as T);
        setIsLoading(false);
    })
    .catch((err) => {
        if (err instanceof CanceledError) return;
        seterror(err.message);
        setIsLoading(false)
    })

  return () => controller.abort()
}, deps ? [...deps] : [])

  return { responseData, error, isLoading };
};

export default useData;
