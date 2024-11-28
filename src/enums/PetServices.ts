export enum PetServices {
  OWNER_HOUSE = "owner_house",
  SITTER_HOUSE = "sitter_house",
  VISIT = "visit",
}

export const serviceOptions = [
  { label: "泊まって", value: PetServices.OWNER_HOUSE },
  { label: "自宅", value: PetServices.SITTER_HOUSE },
  { label: "訪問", value: PetServices.VISIT },
];
