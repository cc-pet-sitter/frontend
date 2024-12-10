export enum PetServices {
  OWNER_HOUSE = "owner_house",
  SITTER_HOUSE = "sitter_house",
  VISIT = "visit",
}

export const serviceOptions = [
  { label: "boarding", value: PetServices.SITTER_HOUSE },
  { label: "stay-in", value: PetServices.OWNER_HOUSE },
  { label: "visit", value: PetServices.VISIT },
];