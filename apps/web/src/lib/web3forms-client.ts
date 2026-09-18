const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

export type Web3FormsInquiry = {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
  propertyTitle: string;
};

export async function sendToWeb3Forms(input: Web3FormsInquiry): Promise<boolean> {
  if (!WEB3FORMS_ACCESS_KEY) {
    return false;
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Nueva consulta: ${input.propertyTitle}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        property_id: input.propertyId,
        property_title: input.propertyTitle,
      }),
    });

    const data = await response.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}
