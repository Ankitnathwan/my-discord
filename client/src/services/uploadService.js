import api from "../lib/api";

export async function uploadImage(file) {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.post("/uploads/image", formData);

  return data.url;
}