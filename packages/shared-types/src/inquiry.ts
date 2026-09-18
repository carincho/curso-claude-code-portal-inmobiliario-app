export type CreateInquiryInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
};

export type InquiryDTO = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  createdAt: string;
};
