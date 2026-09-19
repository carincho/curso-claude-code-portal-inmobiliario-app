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
  userId: string | null;
  createdAt: string;
};

export type InquiryWithPropertyDTO = {
  id: string;
  message: string;
  createdAt: string;
  property: {
    id: string;
    title: string;
  };
};
