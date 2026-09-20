const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImage(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!IMGBB_API_KEY) {
    throw new Error(
      "ImgBB API key is missing. Please check NEXT_PUBLIC_IMGBB_API_KEY."
    );
  }

  const formData = new FormData();

  formData.append("key", IMGBB_API_KEY);
  formData.append("image", file);

  const response = await fetch(
    "https://api.imgbb.com/1/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("ImgBB returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data?.error?.message ||
        "Image upload failed. Please try again."
    );
  }

  return data.data.url;
}