import api from "./axiosInstance";

export const getClientFinanceSummary = async () => {
  try {
    const response = await api.get("/client-auth/finance-summary");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClientInvoices = async () => {
  try {
    const response = await api.get("/client-auth/invoices");
    const body = response.data;
    return {
      success: body.success,
      data: Array.isArray(body.data) ? body.data : [],
      message: body.message,
    };
  } catch (error) {
    throw error;
  }
};
