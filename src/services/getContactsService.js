import axios from "axios";
const bearerToken = import.meta.env.VITE_TOKEN;
const companyId = import.meta.env.VITE_COMPANY_ID;
const headers = { Authorization: `Bearer ${bearerToken}` };

export const getContatsService = async (page, searchQuery, countryId) => {
  console.log(page, searchQuery, countryId, "apihit");
  const apiUrl = `https://api.dev.pastorsline.com/api/contacts.json?companyId=${companyId}&page=${page}${
    searchQuery ? `&query=${searchQuery}` : ""
  }${countryId ? `&countryId=${countryId}` : ""}`;

  try {
    const response = await axios.get(apiUrl, { headers });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};
