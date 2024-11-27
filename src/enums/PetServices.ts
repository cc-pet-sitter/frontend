export enum PetServices {
    OWNER_HOUSE = "owner_house",
    SITTER_HOUSE = "sitter_house",
    VISIT = "visit",
  }
  
  export const serviceOptions = [
    { label: "stayIn", value: PetServices.OWNER_HOUSE },
    { label: "boarding", value: PetServices.SITTER_HOUSE },
    { label: "dropIn", value: PetServices.VISIT },
  ];