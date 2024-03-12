export interface CreateRestaurant {
  name: string;
  email: string;
  imageData: ImageData;
  phoneNumber: string;
  street: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

interface ImageData {
  imageName: string;
  imageMimetype: string;
  fullImage: string;
  thumbnailImage: string;
}
