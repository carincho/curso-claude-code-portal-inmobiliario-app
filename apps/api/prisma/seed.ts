import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";
import type { OperationType, PropertyType } from "../src/generated/prisma/enums";
import type { Role } from "../src/generated/prisma/enums";

const TEST_USER_PASSWORD = "Password123!";

const TEST_USERS: { name: string; email: string; role: Role }[] = [
  { name: "Usuario de Prueba", email: "usuario@portalinmobiliario.test", role: "USER" },
  { name: "Administrador", email: "admin@portalinmobiliario.test", role: "ADMIN" },
];

const FEATURE_NAMES = [
  "Piscina",
  "Gimnasio",
  "Quincho",
  "Lavandería",
  "Jardín",
  "Terraza",
  "Bodega",
  "Ascensor",
  "Conserjería",
  "Seguridad",
  "Calefacción",
  "Aire acondicionado",
  "Pet friendly",
] as const;

type PropertySeed = {
  title: string;
  description: string;
  operationType: OperationType;
  propertyType: PropertyType;
  price: number;
  usableArea?: number;
  totalArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  age?: number;
  address: string;
  commune: string;
  city: string;
  region: string;
  isPublished: boolean;
  isFeatured: boolean;
  features: (typeof FEATURE_NAMES)[number][];
  imageSeeds: string[];
};

const PROPERTIES: PropertySeed[] = [
  {
    title: "Departamento moderno con vista a Chapultepec",
    description:
      "Amplio departamento de dos recámaras en torre reciente, a pasos del Bosque de Chapultepec. Acabados de lujo y excelente iluminación natural.",
    operationType: "SALE",
    propertyType: "APARTMENT",
    price: 285000,
    usableArea: 95,
    totalArea: 100,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    age: 3,
    address: "Av. Presidente Masaryk 123",
    commune: "Polanco",
    city: "Ciudad de México",
    region: "Ciudad de México",
    isPublished: true,
    isFeatured: true,
    features: ["Gimnasio", "Piscina", "Ascensor", "Conserjería", "Seguridad"],
    imageSeeds: ["polanco-depto-1", "polanco-depto-2", "polanco-depto-3"],
  },
  {
    title: "Loft en Condesa cerca de Parque México",
    description:
      "Loft con doble altura en edificio Art Decó, ideal para profesionales jóvenes. Zona con la mejor oferta gastronómica de la ciudad.",
    operationType: "RENT",
    propertyType: "APARTMENT",
    price: 1200,
    usableArea: 60,
    totalArea: 65,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    age: 20,
    address: "Calle Ámsterdam 45",
    commune: "Condesa",
    city: "Ciudad de México",
    region: "Ciudad de México",
    isPublished: true,
    isFeatured: false,
    features: ["Pet friendly", "Terraza", "Seguridad"],
    imageSeeds: ["condesa-loft-1", "condesa-loft-2"],
  },
  {
    title: "Casa familiar con jardín en Coyoacán",
    description:
      "Casa de dos plantas en calle arbolada, a minutos del Centro Histórico de Coyoacán. Amplio jardín y espacio para home office.",
    operationType: "SALE",
    propertyType: "HOUSE",
    price: 420000,
    usableArea: 220,
    totalArea: 300,
    bedrooms: 4,
    bathrooms: 3,
    parkingSpaces: 2,
    age: 15,
    address: "Calle Francisco Sosa 210",
    commune: "Coyoacán",
    city: "Ciudad de México",
    region: "Ciudad de México",
    isPublished: true,
    isFeatured: true,
    features: ["Jardín", "Bodega", "Seguridad", "Pet friendly"],
    imageSeeds: ["coyoacan-casa-1", "coyoacan-casa-2", "coyoacan-casa-3"],
  },
  {
    title: "Oficina corporativa en Santa Fe",
    description:
      "Piso completo en corporativo clase A, listo para operar. Ideal para empresas que buscan presencia en el corredor financiero de Santa Fe.",
    operationType: "RENT",
    propertyType: "OFFICE",
    price: 4500,
    usableArea: 180,
    totalArea: 200,
    parkingSpaces: 6,
    age: 5,
    address: "Av. Santa Fe 495",
    commune: "Santa Fe",
    city: "Ciudad de México",
    region: "Ciudad de México",
    isPublished: true,
    isFeatured: false,
    features: ["Aire acondicionado", "Ascensor", "Seguridad"],
    imageSeeds: ["santafe-oficina-1", "santafe-oficina-2"],
  },
  {
    title: "Casa en fraccionamiento cerrado en Providencia",
    description:
      "Casa de una planta en fraccionamiento con vigilancia 24 horas, cerca de plazas comerciales y zonas verdes de Providencia.",
    operationType: "SALE",
    propertyType: "HOUSE",
    price: 310000,
    usableArea: 180,
    totalArea: 250,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 2,
    age: 8,
    address: "Av. Pablo Neruda 550",
    commune: "Providencia",
    city: "Guadalajara",
    region: "Jalisco",
    isPublished: true,
    isFeatured: false,
    features: ["Jardín", "Seguridad", "Terraza"],
    imageSeeds: ["providencia-casa-1", "providencia-casa-2"],
  },
  {
    title: "Departamento equipado en Chapalita",
    description:
      "Departamento de un dormitorio, completamente amueblado y equipado, ideal para estancias de mediano plazo en Guadalajara.",
    operationType: "RENT",
    propertyType: "APARTMENT",
    price: 650,
    usableArea: 55,
    totalArea: 58,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    age: 6,
    address: "Av. de las Rosas 88",
    commune: "Chapalita",
    city: "Guadalajara",
    region: "Jalisco",
    isPublished: true,
    isFeatured: false,
    features: ["Gimnasio", "Lavandería", "Conserjería"],
    imageSeeds: ["chapalita-depto-1", "chapalita-depto-2"],
  },
  {
    title: "Residencia de lujo en San Pedro Garza García",
    description:
      "Residencia de diseño contemporáneo con alberca privada, en una de las zonas más exclusivas del área metropolitana de Monterrey.",
    operationType: "SALE",
    propertyType: "HOUSE",
    price: 890000,
    usableArea: 420,
    totalArea: 600,
    bedrooms: 5,
    bathrooms: 5,
    parkingSpaces: 4,
    age: 4,
    address: "Calle Sierra Madre 310",
    commune: "San Pedro Garza García",
    city: "Monterrey",
    region: "Nuevo León",
    isPublished: true,
    isFeatured: true,
    features: ["Piscina", "Jardín", "Seguridad", "Aire acondicionado", "Quincho"],
    imageSeeds: ["sanpedro-casa-1", "sanpedro-casa-2", "sanpedro-casa-3"],
  },
  {
    title: "Oficinas en Valle Oriente",
    description:
      "Suite de oficinas en torre corporativa con vista panorámica, en el corredor de negocios de Valle Oriente.",
    operationType: "SALE",
    propertyType: "OFFICE",
    price: 350000,
    usableArea: 140,
    totalArea: 150,
    parkingSpaces: 3,
    age: 2,
    address: "Av. Lázaro Cárdenas 2400",
    commune: "Valle Oriente",
    city: "Monterrey",
    region: "Nuevo León",
    isPublished: true,
    isFeatured: false,
    features: ["Ascensor", "Aire acondicionado", "Seguridad"],
    imageSeeds: ["valleoriente-oficina-1", "valleoriente-oficina-2"],
  },
  {
    title: "Terreno residencial en Juriquilla",
    description:
      "Terreno plano en desarrollo residencial con servicios listos, ideal para construir casa habitación en una de las zonas de mayor plusvalía de Querétaro.",
    operationType: "SALE",
    propertyType: "LAND",
    price: 95000,
    totalArea: 350,
    address: "Circuito Juriquilla Privada 12",
    commune: "Juriquilla",
    city: "Querétaro",
    region: "Querétaro",
    isPublished: true,
    isFeatured: false,
    features: ["Seguridad"],
    imageSeeds: ["juriquilla-terreno-1"],
  },
  {
    title: "Terreno comercial en Angelópolis",
    description:
      "Terreno sobre avenida principal, uso de suelo mixto, cercano a centros comerciales y universidades de la zona de Angelópolis.",
    operationType: "SALE",
    propertyType: "LAND",
    price: 180000,
    totalArea: 500,
    address: "Blvd. del Niño Poblano 2200",
    commune: "Angelópolis",
    city: "Puebla",
    region: "Puebla",
    isPublished: true,
    isFeatured: false,
    features: [],
    imageSeeds: ["angelopolis-terreno-1"],
  },
  {
    title: "Departamento frente al mar en Zona Hotelera",
    description:
      "Departamento con vista directa al mar Caribe, en la Zona Hotelera de Cancún. Ideal para renta vacacional o de temporada.",
    operationType: "RENT",
    propertyType: "APARTMENT",
    price: 2200,
    usableArea: 85,
    totalArea: 90,
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 1,
    age: 7,
    address: "Blvd. Kukulcán Km 12.5",
    commune: "Zona Hotelera",
    city: "Cancún",
    region: "Quintana Roo",
    isPublished: true,
    isFeatured: true,
    features: ["Piscina", "Gimnasio", "Aire acondicionado", "Seguridad"],
    imageSeeds: ["cancun-depto-1", "cancun-depto-2", "cancun-depto-3"],
  },
  {
    title: "Casa colonial remodelada en el Centro de Mérida",
    description:
      "Casa de estilo colonial completamente remodelada, conservando elementos originales, a pocas cuadras del Paseo de Montejo.",
    operationType: "RENT",
    propertyType: "HOUSE",
    price: 950,
    usableArea: 160,
    totalArea: 200,
    bedrooms: 3,
    bathrooms: 2,
    parkingSpaces: 1,
    age: 60,
    address: "Calle 60 470",
    commune: "Centro",
    city: "Mérida",
    region: "Yucatán",
    isPublished: true,
    isFeatured: false,
    features: ["Jardín", "Aire acondicionado", "Pet friendly"],
    imageSeeds: ["merida-casa-1", "merida-casa-2"],
  },
];

function buildImageUrl(seed: string) {
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

async function seedTestUsers() {
  console.log("Creando usuarios de prueba...");
  const passwordHash = await hashPassword(TEST_USER_PASSWORD);

  for (const user of TEST_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { name: user.name, email: user.email, role: user.role, passwordHash },
    });
  }
}

async function main() {
  await seedTestUsers();

  console.log("Limpiando datos de propiedades existentes...");
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.feature.deleteMany();

  console.log("Creando características...");
  const features = await Promise.all(
    FEATURE_NAMES.map((name) => prisma.feature.create({ data: { name } })),
  );
  const featureIdByName = new Map(features.map((feature) => [feature.name, feature.id]));

  console.log(`Creando ${PROPERTIES.length} propiedades...`);
  for (const property of PROPERTIES) {
    const { features: featureNames, imageSeeds, ...propertyData } = property;

    await prisma.property.create({
      data: {
        ...propertyData,
        features: {
          connect: featureNames.map((name) => ({ id: featureIdByName.get(name) })),
        },
        images: {
          create: imageSeeds.map((seed, index) => ({
            url: buildImageUrl(seed),
            publicId: `seed/${seed}`,
            position: index,
            isMain: index === 0,
          })),
        },
      },
    });
  }

  console.log("Seed completado.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
