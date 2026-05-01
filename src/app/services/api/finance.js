import api from "./axiosInstance";

export const getClientFinanceSummary = async () => {
  const response = await api.get("/client-auth/finance-summary");
  return response.data;
};

export const getClientInvoices = async () => {
  const response = await api.get("/client-auth/invoices");
  return response.data;
};
